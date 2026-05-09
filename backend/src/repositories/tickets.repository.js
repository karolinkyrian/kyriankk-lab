const tickets = [];

module.exports = {
  getAll: () => tickets,

  getById: (id) => tickets.find(t => t.id === id),

  create: (ticket) => tickets.push(ticket),

  update: (id, data) => {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return null;

    tickets[index] = { ...tickets[index], ...data };
    return tickets[index];
  },

  delete: (id) => {
    const index = tickets.findIndex(t => t.id === id);
    if (index === -1) return false;

    tickets.splice(index, 1);
    return true;
  }
};