const repo = require("../repositories/tickets.repository");
const { createTicketDto, ticketResponseDto } = require("../dto/ticket.dto");

const genId = () => Date.now().toString();

module.exports = {

  getAll: (query) => {
    let data = repo.getAll();

    if (query?.status) {
      data = data.filter(t => t.status === query.status);
    }

    if (query?.priority) {
      data = data.filter(t => t.priority === query.priority);
    }

    if (query?.sortBy) {
      data.sort((a, b) => {
        const dir = query.sortDir === "desc" ? -1 : 1;

        if (a[query.sortBy] > b[query.sortBy]) return dir;
        if (a[query.sortBy] < b[query.sortBy]) return -dir;
        return 0;
      });
    }

    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 5;

    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      items: data.slice(start, end).map(ticketResponseDto),
      total: data.length,
      page,
      limit
    };
  },

  getById: (id) => {
    const ticket = repo.getById(id);
    if (!ticket) {
      throw {
        status: 404,
        code: "NOT_FOUND",
        message: "Ticket not found"
      };
    }
    return ticketResponseDto(ticket);
  },

  create: (dto) => {
    if (!dto.title) {
      throw {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "title required"
      };
    }

    const ticket = {
      id: genId(),
      ...createTicketDto(dto)
    };

    repo.create(ticket);

    return ticketResponseDto(ticket);
  },

  update: (id, dto) => {
    const updated = repo.update(id, dto);
    if (!updated) {
      throw {
        status: 404,
        code: "NOT_FOUND",
        message: "Ticket not found"
      };
    }

    return ticketResponseDto(updated);
  },

  patch: (id, dto) => {
    const updated = repo.update(id, dto);
    if (!updated) {
      throw {
        status: 404,
        code: "NOT_FOUND",
        message: "Ticket not found"
      };
    }

    return ticketResponseDto(updated);
  },

  delete: (id) => {
    const ok = repo.delete(id);
    if (!ok) {
      throw {
        status: 404,
        code: "NOT_FOUND",
        message: "Ticket not found"
      };
    }
  }
};