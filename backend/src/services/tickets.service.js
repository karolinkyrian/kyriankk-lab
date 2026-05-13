const ticketsRepository = require("../repositories/tickets.repository");

async function getAllTickets(status, sort, order) {
  return await ticketsRepository.getAllTickets(
    status,
    sort,
    order
  );
}

async function getTicketById(id) {
  return await ticketsRepository.getTicketById(id);
}

async function createTicket(data) {
  return await ticketsRepository.createTicket(data);
}

async function updateTicket(
  id,
  subject,
  description,
  status,
  priority
) {
  return await ticketsRepository.updateTicket(
    id,
    subject,
    description,
    status,
    priority
  );
}

async function deleteTicket(id) {
  return await ticketsRepository.deleteTicket(id);
}

async function getTicketsWithUsers() {
  return await ticketsRepository.getTicketsWithUsers();
}

async function getTicketsStats() {
  return await ticketsRepository.getTicketsStats();
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