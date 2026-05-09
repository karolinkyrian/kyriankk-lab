const repo = require("../repositories/tickets.repository");
const { createTicketDto, ticketResponseDto } = require("../dto/ticket.dto");

const genId = () => Date.now().toString();

module.exports = {
  // GET ALL (filter + pagination + sorting)
  getAll: (query) => {
    let data = repo.getAll();

    // FILTER
    if (query?.status) {
      data = data.filter(t => t.status === query.status);
    }

    if (query?.priority) {
      data = data.filter(t => t.priority === query.priority);
    }

    // SORTING
    if (query?.sortBy) {
      data.sort((a, b) => {
        const dir = query.sortDir === "desc" ? -1 : 1;

        if (a[query.sortBy] > b[query.sortBy]) return dir;
        if (a[query.sortBy] < b[query.sortBy]) return -dir;
        return 0;
      });
    }

    // PAGINATION
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

  // GET BY ID
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

  // CREATE
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

  // UPDATE (PUT)
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

  // PATCH
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

  // DELETE
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