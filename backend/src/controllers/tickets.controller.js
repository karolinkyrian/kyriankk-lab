const ticketsService = require("../services/tickets.service");

async function getAll(req, res, next) {
  try {
    const data = await ticketsService.getAllTickets(
      req.query.status,
      req.query.sort,
      req.query.order
    );
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const ticket = await ticketsService.getTicketById(req.params.id, currentUserId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.json({ data: ticket });
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { userId, subject, description, status, priority } = req.body;

    if (!userId || !subject || !description || !status || !priority) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const created = await ticketsService.createTicket(req.body);
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { subject, description, status, priority } = req.body;
    const currentUserId = req.user ? req.user.id : null;

    if (!subject || !description || !status || !priority) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const updated = await ticketsService.updateTicket(
      req.params.id,
      subject,
      description,
      status,
      priority,
      currentUserId
    );

    if (!updated) {
      return res.status(404).json({ error: "Ticket not found or access denied" });
    }

    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const deleted = await ticketsService.deleteTicket(req.params.id, currentUserId);

    if (!deleted) {
      return res.status(404).json({ error: "Ticket not found or access denied" });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

async function getFull(req, res, next) {
  try {
    const data = await ticketsService.getTicketsWithUsers();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const data = await ticketsService.getTicketsStats();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getFull,
  getStats,
};