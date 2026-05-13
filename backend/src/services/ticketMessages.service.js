const { run, get, all } = require("../db/dbClient");

function escape(str) {
  return String(str ?? "").replace(/'/g, "''");
}

async function createMessage(dto) {
  const { ticketId, userId, message } = dto;

  if (!ticketId || !userId || !message) {
    throw new Error("Missing required fields");
  }

  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO TicketMessages (ticketId, userId, message, createdAt)
    VALUES (
      ${Number(ticketId)},
      ${Number(userId)},
      '${escape(message)}',
      '${now}'
    );
  `);

  return await get(`
    SELECT *
    FROM TicketMessages
    WHERE id = ${result.lastID};
  `);
}

async function getAllMessages() {
  return await all(`
    SELECT *
    FROM TicketMessages
    ORDER BY id DESC;
  `);
}

async function getMessageById(id) {
  return await get(`
    SELECT *
    FROM TicketMessages
    WHERE id = ${Number(id)};
  `);
}

async function getMessagesByTicketId(ticketId) {
  return await all(`
    SELECT *
    FROM TicketMessages
    WHERE ticketId = ${Number(ticketId)}
    ORDER BY createdAt ASC;
  `);
}

async function deleteMessage(id) {
  const result = await run(`
    DELETE FROM TicketMessages
    WHERE id = ${Number(id)};
  `);

  return result.changes > 0;
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  getMessagesByTicketId,
  deleteMessage
};