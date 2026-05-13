const express = require("express");

const ticketsRoutes = require("./routes/tickets.routes");
const usersRoutes = require("./routes/users.routes");
const messagesRoutes = require("./routes/ticketMessages.routes");

const { errorHandler } = require("./middleware/error.middleware");
const { initDb } = require("./db/initDb");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.use("/api/tickets", ticketsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);

app.use(errorHandler);

async function bootstrap() {
  try {
    await initDb();

    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
}

bootstrap();