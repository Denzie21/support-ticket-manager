import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { customerRouter } from "./routes/customerRoutes";
import { ticketRouter } from "./routes/ticketRoutes";

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "Customer Support Ticket Manager API is running!"
  });
});

app.use("/api/customers", customerRouter);
app.use("/api/tickets", ticketRouter);

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});