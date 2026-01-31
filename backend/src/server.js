import "dotenv/config"; // Loads your GEMINI_API_KEY from .env
import express from "express";
import cors from "cors";
import morgan from "morgan"; // Industry-standard logging

const app = express();

// --- 1. Middleware ---
// Allows your React frontend to communicate with this backend
app.use(cors());
// Industry-standard logger: shows every request in your terminal
app.use(morgan("dev"));
// Essential: Parses incoming JSON so you can read req.body
app.use(express.json());

// --- 2. Routes ---
// Default display route
app.get("/", (_, res) =>
  res.send(`
    <title>Bharat Welfare Server</title>
    <body style="background: #121212; font-family: sans-serif">
      <h2 style='color: #fff'>Bharat Welfare backend server running!</h2>
    <body>
  `)
);

// Favicon error handler route
app.get("/favicon.ico", (_, res) => res.status(204).end());

// Import your eligibility routes
import eligibilityRoutes from "./routes/eligibility.routes.js";

// Mount the eligibility routes under the /api prefix
app.use("/api", eligibilityRoutes);

// Health check endpoint (Industry standard for monitoring)
app.get("/status", (_, res) => {
  res.json({ status: "Online", timestamp: new Date().toISOString() });
});

// --- 3. Server Initialization ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Bharat Welfare Server running on http://localhost:${PORT}`);
  console.log(`Endpoints active: POST /api/check-eligibility`);
});
