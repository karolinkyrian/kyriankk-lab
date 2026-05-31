import { API_BASE_URL } from "./config.js";

async function request(path, options = {}) {
    const url = `${API_BASE_URL}${path}`;
    let response;
    
    try {
        response = await fetch(url, options);
    } catch (e) {
        throw { status: 0, message: "Помилка мережі або CORS", details: String(e) };
    }

    if (response.status === 204) return null;

    const rawText = await response.text();
    
    if (response.ok) {
        if (!rawText) return null;
        try { return JSON.parse(rawText); } catch { return rawText; }
    }

    let errPayload = null;
    try { errPayload = rawText ? JSON.parse(rawText) : null; } catch {}
    
    throw {
        status: response.status,
        message: errPayload?.message || "HTTP помилка",
        details: errPayload?.detail || rawText || `HTTP ${response.status}`
    };
}

export async function getTickets() {
    return await request("/tickets/full", { method: "GET" });
}

export async function createTicket(dto) {
    return await request("/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dto),
    });
}

export async function updateTicket(id, dto) {
    return await request(`/tickets/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "X-Demo-UserId": "1" 
        },
        body: JSON.stringify(dto),
    });
}

export async function deleteTicket(id) {
    return await request(`/tickets/${encodeURIComponent(id)}`, { 
        method: "DELETE",
        headers: {
            "X-Demo-UserId": "1" 
        }
    });
}

export async function getUsers() {
    return await request("/users", { method: "GET" });
}