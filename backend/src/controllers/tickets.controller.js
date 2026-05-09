const service = require("../services/tickets.service");

exports.getAll = (req, res) => {
  res.json(service.getAll(req.query));
};

exports.getById = (req, res) => {
  res.json(service.getById(req.params.id));
};

exports.create = (req, res) => {
  res.status(201).json(service.create(req.body));
};

exports.update = (req, res) => {
  res.json(service.update(req.params.id, req.body));
};

exports.patch = (req, res) => {
  res.json(service.patch(req.params.id, req.body));
};

exports.delete = (req, res) => {
  service.delete(req.params.id);
  res.sendStatus(204);
};