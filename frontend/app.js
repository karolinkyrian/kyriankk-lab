let tickets = [];
let editId = null;
let sortField = null;
let sortAsc = true;

const API = "http://localhost:3000/api/tickets";

const form = document.getElementById("ticketForm");
const tableBody = document.getElementById("ticketsTable");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");

const subjectInput = document.getElementById("subjectInput");
const statusSelect = document.getElementById("statusSelect");
const prioritySelect = document.getElementById("prioritySelect");
const messageInput = document.getElementById("messageInput");

const subjectError = document.getElementById("subjectError");
const statusError = document.getElementById("statusError");
const priorityError = document.getElementById("priorityError");
const messageError = document.getElementById("messageError");

async function loadTickets() {
  let url = `${API}/full`;

  try {
    const res = await fetch(url);
    const result = await res.json();
    tickets = result.data || [];

    if (sortField) {
      tickets.sort((a, b) => {
        let valA = a[sortField] ? a[sortField].toString().toLowerCase() : "";
        let valB = b[sortField] ? b[sortField].toString().toLowerCase() : "";
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    render();
  } catch (error) {
    console.error("Помилка завантаження тікетів:", error);
  }
}

function render() {
  tableBody.innerHTML = "";

  let data = [...tickets];
  const query = searchInput.value.toLowerCase().trim();

  if (query) {
    data = data.filter((ticket) => {
      return (
        ticket.subject.toLowerCase().includes(query) ||
        (ticket.userName && ticket.userName.toLowerCase().includes(query))
      );
    });
  }

  data.forEach((ticket) => {
    const row = document.createElement("tr");

    if (ticket.id === editId) {
      row.classList.add("editing-row");
    }

    row.innerHTML = `
      <td>${ticket.subject}</td>
      <td>${ticket.status}</td>
      <td>${ticket.priority}</td>
      <td>${ticket.userName}</td>
      <td>
        <button data-edit="${ticket.id}">Редагувати</button>
        <button data-delete="${ticket.id}">Видалити</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll("th[data-field]").forEach((th) => {
    th.classList.remove("active-sort");
    if (sortField === th.dataset.field) {
      th.classList.add("active-sort");
    }
  });
}

function clearErrors() {
  document.querySelectorAll(".error-text").forEach((e) => (e.textContent = ""));
}

function validate() {
  let valid = true;
  clearErrors();

  if (subjectInput.value.trim().length < 3) {
    subjectError.textContent = "Мінімум 3 символи";
    valid = false;
  }

  if (!statusSelect.value) {
    statusError.textContent = "Оберіть статус";
    valid = false;
  }

  if (!prioritySelect.value) {
    priorityError.textContent = "Оберіть пріоритет";
    valid = false;
  }

  if (messageInput.value.trim().length < 10) {
    messageError.textContent = "Мінімум 10 символів";
    valid = false;
  }

  return valid;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  const ticket = {
    userId: 1, 
    subject: subjectInput.value.trim(),
    description: messageInput.value.trim(),
    status: statusSelect.value,
    priority: prioritySelect.value,
  };

  try {
    if (editId) {
      await fetch(`${API}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
      editId = null;
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticket),
      });
    }

    form.reset();
    clearErrors();
    await loadTickets();
  } catch (error) {
    console.error("Помилка збереження:", error);
  }
});

tableBody.addEventListener("click", async (e) => {
  const editIdValue = e.target.dataset.edit;
  const deleteIdValue = e.target.dataset.delete;

  if (deleteIdValue) {
    try {
      await fetch(`${API}/${deleteIdValue}`, { method: "DELETE" });
      await loadTickets();
    } catch (error) {
      console.error("Помилка видалення:", error);
    }
  }

  if (editIdValue) {
    const ticket = tickets.find((t) => t.id == editIdValue);
    if (!ticket) return;

    subjectInput.value = ticket.subject;
    statusSelect.value = ticket.status;
    prioritySelect.value = ticket.priority;
    messageInput.value = ticket.description;
    
    editId = ticket.id;
    render();
  }
});

resetBtn.addEventListener("click", () => {
  form.reset();
  clearErrors();
  editId = null;
  render();
});

searchInput.addEventListener("input", render);

document.querySelectorAll("th[data-field]").forEach((th) => {
  th.addEventListener("click", async () => {
    const field = th.dataset.field;

    if (sortField === field) {
      sortAsc = !sortAsc;
    } else {
      sortField = field;
      sortAsc = true;
    }

    await loadTickets();
  });
});

loadTickets();

