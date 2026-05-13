const { all, get, run } = require("../db/dbClient");

function escape(str) {
  return String(str).replace(/'/g, "''");
}

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
  let sql = `
    SELECT *
    FROM Tickets
  `;

  if (status) {
    sql += `
      WHERE status = '${escape(status)}'
    `;
  }

  sql += `
    ORDER BY ${safeSort(sort)} ${safeOrder(order)}
  `;

  return await all(sql);
}

async function getTicketById(id) {
  return await get(`
    SELECT *
    FROM Tickets
    WHERE id = ${Number(id)};
  `);
}

async function createTicket(data) {
  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO Tickets (
      userId,
      subject,
      description,
      status,
      priority,
      createdAt
    )
    VALUES (
      ${Number(data.userId)},
      '${escape(data.subject)}',
      '${escape(data.description)}',
      '${escape(data.status)}',
      '${escape(data.priority)}',
      '${now}'
    );
  `);

  return await get(`
    SELECT *
    FROM Tickets
    WHERE id = ${result.lastID};
  `);
}

async function updateTicket(id, subject, description, status, priority) {
  const result = await run(`
    UPDATE Tickets
    SET
      subject = '${escape(subject)}',
      description = '${escape(description)}',
      status = '${escape(status)}',
      priority = '${escape(priority)}'
    WHERE id = ${Number(id)};
  `);

  if (result.changes === 0) return null;

  return await get(`
    SELECT *
    FROM Tickets
    WHERE id = ${Number(id)};
  `);
}

async function deleteTicket(id) {
  const result = await run(`
    DELETE FROM Tickets
    WHERE id = ${Number(id)};
  `);

  return result.changes > 0;
}

async function getTicketsWithUsers() {
  return await all(`
    SELECT
      t.id,
      t.subject,
      t.description,
      t.status,
      t.priority,
      t.createdAt,

      u.id AS userId,
      u.name AS userName,
      u.email AS userEmail

    FROM Tickets t
    JOIN Users u ON u.id = t.userId
    ORDER BY t.id DESC;
  `);
}

async function getTicketsStats() {
  return await get(`
    SELECT COUNT(*) AS totalTickets
    FROM Tickets;
  `);
}

async function getLatestTickets() {
  return await all(`
    SELECT *
    FROM Tickets
    WHERE status = 'new'
    ORDER BY createdAt DESC
    LIMIT 5;
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
  getLatestTickets,
};