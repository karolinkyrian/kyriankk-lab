const express = require("express");

const controller = require(
  "../controllers/tickets.controller"
);

const router = express.Router();

router.get("/", controller.getAll);

router.get("/full", controller.getFull);

router.get("/stats", controller.getStats);

router.get("/:id", controller.getById);

router.post("/", controller.create);

router.put("/:id", controller.update);

router.delete("/:id", controller.remove);

module.exports = router;