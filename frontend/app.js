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
const authorInput = document.getElementById("authorInput");

const subjectError = document.getElementById("subjectError");
const statusError = document.getElementById("statusError");
const priorityError = document.getElementById("priorityError");
const messageError = document.getElementById("messageError");
const authorError = document.getElementById("authorError");

async function loadTickets() {
  const res = await fetch(API);
  const data = await res.json();
  tickets = data.items || [];
  render();
}

function render() {
  tableBody.innerHTML = "";

  let data = [...tickets];

  const query = searchInput.value.toLowerCase().trim();
  if (query) {
    data = data.filter(t =>
      t.subject.toLowerCase().includes(query) ||
      t.author.toLowerCase().includes(query)
    );
  }

  if (sortField) {

    const statusOrder = {
      "new": 1,
      "inprogress": 2,
      "done": 3
    };

    const priorityOrder = {
      "low": 1,
      "medium": 2,
      "high": 3
    };

    data.sort((a, b) => {
      let A, B;

      switch (sortField) {

        case "subject":
        case "author":
          A = a[sortField].toLowerCase();
          B = b[sortField].toLowerCase();
          break;

        case "status":
          A = statusOrder[String(a.status).toLowerCase()] || 0;
          B = statusOrder[String(b.status).toLowerCase()] || 0;
          break;

        case "priority":
          A = priorityOrder[String(a.priority).toLowerCase()] || 0;
          B = priorityOrder[String(b.priority).toLowerCase()] || 0;
          break;
      }

      if (A < B) return sortAsc ? -1 : 1;
      if (A > B) return sortAsc ? 1 : -1;
      return 0;
    });
  }

  data.forEach(ticket => {
    const row = document.createElement("tr");

    if (ticket.id === editId) {
      row.classList.add("editing-row");
    }

    row.innerHTML = `
      <td>${ticket.subject}</td>
      <td>${ticket.status}</td>
      <td>${ticket.priority}</td>
      <td>${ticket.author}</td>
      <td>
        <button data-edit="${ticket.id}">Редагувати</button>
        <button data-delete="${ticket.id}">Видалити</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll("th[data-field]").forEach(th => {
    th.classList.remove("active-sort");

    if (sortField && th.dataset.field === sortField) {
      th.classList.add("active-sort");
    }
  });
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

  if (authorInput.value.trim().length < 2) {
    authorError.textContent = "Мінімум 2 символи";
    valid = false;
  }

  return valid;
}

function clearErrors() {
  document.querySelectorAll(".error-text").forEach(e => e.textContent = "");
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  if (!validate()) return;

  const ticket = {
    subject: subjectInput.value.trim(),
    status: statusSelect.value,
    priority: prioritySelect.value,
    message: messageInput.value.trim(),
    author: authorInput.value.trim()
  };

  if (editId) {
    await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket)
    });

    editId = null;
  } else {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket)
    });
  }

  form.reset();

  await loadTickets();
});

tableBody.addEventListener("click", async e => {
  const edit = e.target.dataset.edit;
  const del = e.target.dataset.delete;

  if (del) {
    await fetch(`${API}/${del}`, { method: "DELETE" });
    await loadTickets();
  }

  if (edit) {
    const t = tickets.find(x => x.id == edit);
    if (!t) return;

    subjectInput.value = t.subject;
    statusSelect.value = t.status;
    prioritySelect.value = t.priority;
    messageInput.value = t.message;
    authorInput.value = t.author;

    editId = t.id;
  }
});


resetBtn.addEventListener("click", () => {
  form.reset();
  editId = null;
  clearErrors();
});

searchInput.addEventListener("input", render);

document.querySelectorAll("th[data-field]").forEach(th => {
  th.addEventListener("click", () => {
    const field = th.dataset.field;

    if (sortField === field) {
      sortField = null;
    } else {
      sortField = field;
      sortAsc = true;
    }

    render();
  });
});

loadTickets();


