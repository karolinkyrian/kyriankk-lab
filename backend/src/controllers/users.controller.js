const userService = require("../services/users.service");

exports.create = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const user = await userService.create(req.body);

    res.status(201).json({
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const data = await userService.getAll(req.query);

    res.json({
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const updated = await userService.update(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const deleted = await userService.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      success: true,
      deleted: true,
    });
  } catch (err) {
    next(err);
  }
};