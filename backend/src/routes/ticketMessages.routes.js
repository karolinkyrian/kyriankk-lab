const express = require("express");
const controller = require("../controllers/ticketMessages.controller");

const router = express.Router();

router.post("/", controller.create);
router.get("/", controller.getAll);

router.get("/ticket/:ticketId", controller.getByTicketId);

router.get("/:id", controller.getById);
router.delete("/:id", controller.remove);

module.exports = router;