const { all, get, run } = require("../db/dbClient");

const ALLOWED_SORT_FIELDS = ["id", "createdAt", "status", "priority"];
const ALLOWED_ORDER = ["ASC", "DESC"];

function safeSort(sort) {
  if (ALLOWED_SORT_FIELDS.includes(sort)) return sort;
  return "createdAt";
}
function safeOrder(order) {
  if (ALLOWED_ORDER.includes(order)) return order;
  return "DESC";
}

async function getAllTickets(status, sort, order) {
  let sql = "SELECT * FROM Tickets";
  const params = [];

  if (status) {
    sql += " WHERE status = ?";
    params.push(status);
  }

  sql += ` ORDER BY ${safeSort(sort)} ${safeOrder(order)}`;
  return await all(sql, params);
}

async function getTicketById(id, currentUserId) {
  return await get(
    "SELECT * FROM Tickets WHERE id = ? AND userId = ?",
    [Number(id), Number(currentUserId)]
  );
}

async function createTicket(data) {
  const now = new Date().toISOString();
  const result = await run(
    `INSERT INTO Tickets (userId, subject, description, status, priority, createdAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [data.userId, data.subject, data.description, data.status, data.priority, now]
  );
  return await get("SELECT * FROM Tickets WHERE id = ?", [result.lastID]);
}

async function updateTicket(id, subject, description, status, priority, currentUserId) {
  const result = await run(
    `UPDATE Tickets
     SET subject = ?, description = ?, status = ?, priority = ?
     WHERE id = ? AND userId = ?`,
    [subject, description, status, priority, Number(id), Number(currentUserId)]
  );

  if (result.changes === 0) return null;
  return await get("SELECT * FROM Tickets WHERE id = ?", [Number(id)]);
}

async function deleteTicket(id, currentUserId) {
  const result = await run(
    "DELETE FROM Tickets WHERE id = ? AND userId = ?",
    [Number(id), Number(currentUserId)]
  );
  return result.changes > 0;
}

async function getTicketsWithUsers() {
  return await all(`
    SELECT
      t.id, t.subject, t.description, t.status, t.priority, t.createdAt,
      u.id AS userId, u.name AS userName, u.email AS userEmail
    FROM Tickets t
    JOIN Users u ON u.id = t.userId
    ORDER BY t.id DESC;
  `);
}

async function getTicketsStats() {
  return await get(`
    SELECT COUNT(*) AS totalTickets,
           SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS newTickets,
           SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS inProgressTickets,
           SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS doneTickets
    FROM Tickets;
  `);
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketsWithUsers,
  getTicketsStats,
};
