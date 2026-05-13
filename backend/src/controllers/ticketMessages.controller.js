const service = require("../services/ticketMessages.service");

async function create(req, res, next) {
  try {
    const { ticketId, userId, message } = req.body;

    if (!ticketId || !userId || !message) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const created = await service.createMessage(req.body);

    res.status(201).json({
      data: created
    });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const data = await service.getAllMessages();

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const msg = await service.getMessageById(req.params.id);

    if (!msg) {
      return res.status(404).json({
        error: "Message not found"
      });
    }

    res.json({ data: msg });
  } catch (err) {
    next(err);
  }
}

async function getByTicketId(req, res, next) {
  try {
    const data = await service.getMessagesByTicketId(req.params.ticketId);

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await service.deleteMessage(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "Message not found"
      });
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  getByTicketId,
  remove
};