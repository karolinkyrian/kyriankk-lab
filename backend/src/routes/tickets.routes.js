const express = require("express");
const router = express.Router();

let tickets = [];

router.get("/", (req, res) => {
  res.json({ items: tickets });
});

router.post("/", (req, res) => {
  const { subject, status, priority, message, author } = req.body;

  if (!subject) {
    return res.status(400).json({
      error: { code: "VALIDATION", message: "subject required" }
    });
  }

  if (!status) {
    return res.status(400).json({
      error: { code: "VALIDATION", message: "status required" }
    });
  }

  if (!priority) {
    return res.status(400).json({
      error: { code: "VALIDATION", message: "priority required" }
    });
  }

  if (!message) {
    return res.status(400).json({
      error: { code: "VALIDATION", message: "message required" }
    });
  }

  if (!author) {
    return res.status(400).json({
      error: { code: "VALIDATION", message: "author required" }
    });
  }

  const newTicket = {
    id: Date.now(),
    subject,
    status,
    priority,
    message,
    author
  };

  tickets.push(newTicket);

  res.json(newTicket);
});

router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { subject, status, priority, message, author } = req.body;

  const index = tickets.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Not found" });
  }

  tickets[index] = {
    id,
    subject,
    status,
    priority,
    message,
    author
  };

  res.json(tickets[index]);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  tickets = tickets.filter(t => t.id !== id);

  res.json({ ok: true });
});

module.exports = router;