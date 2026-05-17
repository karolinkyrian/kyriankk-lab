import { getTickets, createTicket, deleteTicket, updateTicket, getUsers } from "./apiClient.js";
import { renderStatus, showNotice, renderTicketsTable, renderUsersSelect } from "./ui.js";

let editId = null;
let allTickets = [];
let sortField = null;
let sortAsc = true;

async function init() {
    try {
        const res = await getUsers();
        const users = Array.isArray(res) ? res : res?.data?.items || [];
        renderUsersSelect(users);
    } catch (err) {
        showNotice(`Не вдалося завантажити авторів: ${err.message}`);
    }
    await loadTickets();
}

async function loadTickets() {
    renderStatus("loading");
    try {
        const response = await getTickets();
        allTickets = Array.isArray(response) ? response : response?.data || [];

        if (allTickets.length === 0) {
            renderTicketsTable([], () => {}, () => {});
            renderStatus("empty");
            return;
        }

        renderData(); 
        renderStatus("success");
    } catch (err) {
        allTickets = [];
        renderTicketsTable([], () => {}, () => {}); 
        renderStatus("error", err);
    }
}

function renderData() {
    let data = [...allTickets];
    const query = document.getElementById("searchInput").value.toLowerCase().trim();

    if (query) {
        data = data.filter((ticket) => 
            (ticket.subject && ticket.subject.toLowerCase().includes(query)) ||
            (ticket.userName && ticket.userName.toLowerCase().includes(query))
        );
    }

    if (sortField) {
        data.sort((a, b) => {
            let valA = a[sortField] ? a[sortField].toString().toLowerCase() : "";
            let valB = b[sortField] ? b[sortField].toString().toLowerCase() : "";
            if (valA < valB) return sortAsc ? -1 : 1;
            if (valA > valB) return sortAsc ? 1 : -1;
            return 0;
        });
    }

    renderTicketsTable(data, handleEdit, handleDelete);

    document.querySelectorAll("th[data-field]").forEach((th) => {
        th.classList.remove("active-sort");
        if (sortField === th.dataset.field) {
            th.classList.add("active-sort");
        }
    });
}

document.getElementById("searchInput").addEventListener("input", renderData);

document.querySelectorAll("th[data-field]").forEach((th) => {
    th.addEventListener("click", () => {
        const field = th.dataset.field;
        if (sortField === field) {
            sortAsc = !sortAsc;
        } else {
            sortField = field;
            sortAsc = true;
        }
        renderData();
    });
});

function handleEdit(ticket) {
    editId = ticket.id;
    document.getElementById("subjectInput").value = ticket.subject;
    document.getElementById("userSelect").value = ticket.userId;
    document.getElementById("statusSelect").value = ticket.status;
    document.getElementById("prioritySelect").value = ticket.priority;
    document.getElementById("messageInput").value = ticket.description;
    
    document.getElementById("submitBtn").textContent = "Оновити";
    document.getElementById("cancelEditBtn").style.display = "inline-block";
}

document.getElementById("cancelEditBtn").addEventListener("click", () => {
    editId = null;
    document.getElementById("ticketForm").reset();
    document.getElementById("submitBtn").textContent = "Зберегти";
    document.getElementById("cancelEditBtn").style.display = "none";
});

async function handleDelete(id) {
    if (!confirm("Ви впевнені, що хочете видалити цю заявку?")) return;
    try {
        await deleteTicket(id);
        showNotice("Заявку успішно видалено");
        await loadTickets();
    } catch (err) {
        showNotice(`Помилка видалення: ${err.message}`);
    }
}

document.getElementById("ticketForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    btn.disabled = true; 

    const dto = {
        userId: parseInt(document.getElementById("userSelect").value), 
        subject: document.getElementById("subjectInput").value,
        description: document.getElementById("messageInput").value,
        status: document.getElementById("statusSelect").value,
        priority: document.getElementById("prioritySelect").value
    };

    try {
        if (editId) {
            await updateTicket(editId, dto);
            showNotice("Заявку оновлено!");
            editId = null;
            document.getElementById("submitBtn").textContent = "Зберегти";
            document.getElementById("cancelEditBtn").style.display = "none";
        } else {
            await createTicket(dto);
            showNotice("Заявку створено!");
        }
        
        document.getElementById("ticketForm").reset();
        await loadTickets();
    } catch (err) {
        showNotice(`Помилка: ${err.message}`);
    } finally {
        btn.disabled = false;
    }
});

document.getElementById("resetBtn").addEventListener("click", () => {
    document.getElementById("ticketForm").reset();
    editId = null;
    document.getElementById("submitBtn").textContent = "Зберегти";
    document.getElementById("cancelEditBtn").style.display = "none";
});

init();