"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const customerRoutes_1 = require("./routes/customerRoutes");
const ticketRoutes_1 = require("./routes/ticketRoutes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173"
}));
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        status: "success",
        message: "Customer Support Ticket Manager API is running!"
    });
});
app.use("/api/customers", customerRoutes_1.customerRouter);
app.use("/api/tickets", ticketRoutes_1.ticketRouter);
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
