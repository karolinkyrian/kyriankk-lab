const router = require("express").Router();
const c = require("../controllers/tickets.controller");

router.get("/", c.getAll);
router.get("/:id", c.getById);
router.post("/", c.create);
router.put("/:id", c.update);
router.patch("/:id", c.patch);
router.delete("/:id", c.delete);

module.exports = router;