const repo = require("../repositories/users.repository");

const genId = () => Date.now().toString();

module.exports = {
  getAll: (query) => {
    let data = repo.getAll();

    if (query?.email) {
      data = data.filter(u => u.email.includes(query.email));
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
      items: data.slice(start, end),
      total: data.length,
      page,
      limit
    };
  },

  getById: (id) => {
    const user = repo.getById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    return user;
  },

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

  update: (id, dto) => {
    const updated = repo.update(id, dto);
    if (!updated) throw { status: 404, code: "NOT_FOUND" };
    return updated;
  },

  patch: (id, dto) => {
    const updated = repo.update(id, dto);
    if (!updated) throw { status: 404, code: "NOT_FOUND" };
    return updated;
  },

  delete: (id) => {
    const ok = repo.delete(id);
    if (!ok) throw { status: 404, code: "NOT_FOUND" };
  }
};