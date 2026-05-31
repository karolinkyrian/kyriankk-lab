const express = require("express");
const cors = require("cors");

const ticketsRoutes = require("./routes/tickets.routes");
const usersRoutes = require("./routes/users.routes");
const messagesRoutes = require("./routes/ticketMessages.routes");

const { errorHandler } = require("./middleware/error.middleware");
const { initDb } = require("./db/initDb");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const allowedOrigins = [
  "http://localhost:8000", 
  "http://127.0.0.1:8000",
  "http://localhost:5500",
  "http://127.0.0.1:5500"
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS: origin is not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"]
}));

app.options("*", cors());

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

app.use("/api/v1/tickets", ticketsRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/messages", messagesRoutes);

app.use(errorHandler);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});