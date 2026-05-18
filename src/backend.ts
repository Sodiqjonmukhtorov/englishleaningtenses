import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" }));

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
