const createTicketDto = (dto) => {
  return {
    title: dto.title,
    status: dto.status || "open",
    priority: dto.priority || "low"
  };
};

const ticketResponseDto = (ticket) => {
  return {
    id: ticket.id,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority
  };
};

module.exports = {
  createTicketDto,
  ticketResponseDto
};