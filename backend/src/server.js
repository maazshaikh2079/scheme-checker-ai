import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.get("/", (_, res) =>
  res.send(`
    <title>Bharat Welfare Server</title>
    <body style="background: #121212; font-family: sans-serif">
      <h2 style='color: #fff'>Bharat Welfare backend server running!</h2>
    <body>
  `)
);
app.get("/favicon.ico", (_, res) => res.status(204).end());

import eligibilityRoutes from "./routes/eligibility.routes.js";
app.use("/api", eligibilityRoutes);

// Health check endpoint
app.get("/status", (_, res) => {
  res.json({ status: "Online", timestamp: new Date().toISOString() });
});

// Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Bharat Welfare Server running on http://localhost:${PORT}`);
  console.log(`Endpoints active: POST /api/check-eligibility`);
});
