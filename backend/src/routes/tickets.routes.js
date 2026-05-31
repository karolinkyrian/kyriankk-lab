const express = require("express");
const controller = require("../controllers/tickets.controller");
const { demoAuth } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/full", controller.getFull);
router.get("/stats", controller.getStats);
router.post("/", controller.create);

router.get("/:id", demoAuth, controller.getById);
router.put("/:id", demoAuth, controller.update);
router.delete("/:id", demoAuth, controller.remove);

module.exports = router;