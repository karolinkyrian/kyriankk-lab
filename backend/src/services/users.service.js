const repo = require("../repositories/users.repository");

module.exports = {
  create: async (dto) => {
    console.log("Service DTO check:", dto);

    if (!dto || !dto.name || !dto.email) {
      throw { status: 400, message: "name and email required" };
    }
    
    return await repo.createUser(dto);
  },

  getAll: async (query) => {
    let data = await repo.getAllUsers();
    if (query?.email) {
      data = data.filter(u => u.email.includes(query.email));
    }
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 5;
    const start = (page - 1) * limit;
    
    return {
      items: data.slice(start, start + limit),
      total: data.length,
      page,
      limit
    };
  },

  getById: async (id) => {
    const user = await repo.getUserById(id);
    if (!user) throw { status: 404, message: "User not found" };
    return user;
  },

  delete: async (id) => {
    const ok = await repo.deleteUser(id);
    if (!ok) throw { status: 404, message: "User not found" };
    return true; 
  }
};