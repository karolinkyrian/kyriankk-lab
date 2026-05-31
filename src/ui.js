export function showNotice(text) {
    const el = document.getElementById("notice");
    el.innerHTML = text;
    setTimeout(() => { el.innerHTML = ""; }, 4000);
}

export function renderStatus(status, error = null) {
    const el = document.getElementById("status-container");
    if (!el) return;
    
    if (status === "loading") el.textContent = "Завантаження даних...";
    else if (status === "empty") el.textContent = "Поки що немає жодної заявки.";
    else if (status === "error") {
        el.innerHTML = `<span style="color:red">Помилка: ${error?.message || "Невідома помилка"}</span>`;
    }
    else el.innerHTML = ""; 
}

export function renderUsersSelect(users) {
    const select = document.getElementById("userSelect");
    if (!select) return;
    
    select.innerHTML = '<option value="">Оберіть автора</option>';
    for (const user of users) {
        const option = document.createElement("option");
        option.value = user.id;
        option.textContent = `${user.name} (${user.email})`;
        select.appendChild(option);
    }
}

export function renderTicketsTable(tickets, onEditCallback, onDeleteCallback) {
    const tbody = document.getElementById("ticketsTable");
    if (!tbody) return;
    
    tbody.innerHTML = ""; 

    for (const ticket of tickets) {
        const tr = document.createElement("tr");
        
        const tdSubject = document.createElement("td");
        tdSubject.textContent = ticket.subject || "(Без теми)";
        
        const tdStatus = document.createElement("td");
        tdStatus.textContent = ticket.status || "new";
        
        const tdPriority = document.createElement("td");
        tdPriority.textContent = ticket.priority || "low";
        
        const tdAuthor = document.createElement("td");
        tdAuthor.textContent = ticket.userName || "Невідомий автор";
        
        const tdActions = document.createElement("td");
        tdActions.innerHTML = `
            <button class="edit-btn" data-id="${ticket.id}" style="margin-right: 5px;">Редагувати</button>
            <button class="delete-btn" data-id="${ticket.id}">Видалити</button>
        `;

        tr.appendChild(tdSubject);
        tr.appendChild(tdStatus);
        tr.appendChild(tdPriority);
        tr.appendChild(tdAuthor);
        tr.appendChild(tdActions);

        tr.querySelector(".edit-btn").addEventListener("click", () => onEditCallback(ticket));
        tr.querySelector(".delete-btn").addEventListener("click", () => onDeleteCallback(ticket.id));
        
        tbody.appendChild(tr);
    }
}