
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Express application
const app = express();

// Configure middleware
app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

// Define server port
const PORT = process.env.PORT || 5000;

// First API endpoint
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Customer Support Ticket Manager API is running!"
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
