const repo = require("../repositories/users.repository");

const genId = () => Date.now().toString();

module.exports = {
  // GET ALL (pagination + filter + sorting)
  getAll: (query) => {
    let data = repo.getAll();

    // FILTER
    if (query?.email) {
      data = data.filter(u => u.email.includes(query.email));
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
      items: data.slice(start, end),
      total: data.length,
      page,
      limit
    };
  },

  // GET BY ID
  getById: (id) => {
    const user = repo.getById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    return user;
  },

  // CREATE
  create: (dto) => {
    if (!dto.name) throw { status: 400, code: "VALIDATION", message: "name required" };
    if (!dto.email) throw { status: 400, code: "VALIDATION", message: "email required" };

    const user = {
      id: genId(),
      name: dto.name,
      email: dto.email
    };

    repo.create(user);
    return user;
  },

  // UPDATE (PUT)
  update: (id, dto) => {
    const updated = repo.update(id, dto);
    if (!updated) throw { status: 404, code: "NOT_FOUND" };
    return updated;
  },

  // PATCH (ДОДАЄМО)
  patch: (id, dto) => {
    const updated = repo.update(id, dto);
    if (!updated) throw { status: 404, code: "NOT_FOUND" };
    return updated;
  },

  // DELETE
  delete: (id) => {
    const ok = repo.delete(id);
    if (!ok) throw { status: 404, code: "NOT_FOUND" };
  }
};