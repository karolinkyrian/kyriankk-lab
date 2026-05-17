export function showNotice(text) {
    const el = document.getElementById("notice");
    el.innerHTML = text;
    setTimeout(() => { el.innerHTML = ""; }, 4000);
}

export function renderStatus(status, error = null) {
    const el = document.getElementById("status-container");
    if (!el) return;
    
    if (status === "loading") el.innerHTML = "Завантаження даних...";
    else if (status === "empty") el.innerHTML = "Поки що немає жодної заявки.";
    else if (status === "error") el.innerHTML = `<span style="color:red">Помилка: ${error?.message || "Невідома помилка"}</span>`;
    else el.innerHTML = ""; 
}

export function renderUsersSelect(users) {
    const select = document.getElementById("userSelect");
    if (!select) return;
    
    select.innerHTML = '<option value="">Оберіть автора</option>';
    for (const user of users) {
        select.innerHTML += `<option value="${user.id}">${user.name} (${user.email})</option>`;
    }
}

export function renderTicketsTable(tickets, onEditCallback, onDeleteCallback) {
    const tbody = document.getElementById("ticketsTable");
    if (!tbody) return;
    
    tbody.innerHTML = ""; 

    for (const ticket of tickets) {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
            <td>${ticket.subject || "(Без теми)"}</td>
            <td>${ticket.status || "new"}</td>
            <td>${ticket.priority || "low"}</td>
            <td>${ticket.userName || "Невідомий автор"}</td>
            <td>
                <button class="edit-btn" data-id="${ticket.id}" style="margin-right: 5px;">Редагувати</button>
                <button class="delete-btn" data-id="${ticket.id}">Видалити</button>
            </td>
        `;

        tr.querySelector(".edit-btn").addEventListener("click", () => onEditCallback(ticket));
        tr.querySelector(".delete-btn").addEventListener("click", () => onDeleteCallback(ticket.id));

        tbody.appendChild(tr);
    }
}