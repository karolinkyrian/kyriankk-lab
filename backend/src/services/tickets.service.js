const ticketsRepository = require("../repositories/tickets.repository");

async function getAllTickets(status, sort, order) {
  return await ticketsRepository.getAllTickets(status, sort, order);
}

async function getTicketById(id, currentUserId) {
  return await ticketsRepository.getTicketById(id, currentUserId);
}

async function createTicket(data) {
  return await ticketsRepository.createTicket(data);
}

async function updateTicket(id, subject, description, status, priority, currentUserId) {
  return await ticketsRepository.updateTicket(id, subject, description, status, priority, currentUserId);
}

async function deleteTicket(id, currentUserId) {
  return await ticketsRepository.deleteTicket(id, currentUserId);
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