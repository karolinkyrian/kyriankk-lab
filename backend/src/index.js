const express = require("express");

const userRoutes = require("./routes/users.routes");
const ticketRoutes = require("./routes/tickets.routes");

const logger = require("./middleware/logger.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();

const cors = require("cors");

app.use(cors({
  origin: "http://localhost:8080"
}));

app.use(express.json());
app.use(logger);

app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server running: http://localhost:3000");
});