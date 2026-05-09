const users = [];

module.exports = {
  getAll: () => users,

  getById: (id) => users.find(u => u.id === id),

  create: (user) => users.push(user),

  update: (id, data) => {
    const i = users.findIndex(u => u.id === id);
    if (i === -1) return null;
    users[i] = { ...users[i], ...data };
    return users[i];
  },

  delete: (id) => {
    const i = users.findIndex(u => u.id === id);
    if (i === -1) return false;
    users.splice(i, 1);
    return true;
  }
};