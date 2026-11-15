"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRouter = void 0;
const express_1 = require("express");
const customers_1 = require("../data/customers");
exports.customerRouter = (0, express_1.Router)();
// POST: Create a new customer
exports.customerRouter.post("/", (req, res) => {
    const { name, email, company } = req.body;
    // Validate required fields
    if (typeof name !== "string" ||
        typeof email !== "string" ||
        typeof company !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !company.trim()) {
        return res.status(400).json({
            status: "error",
            message: "Name, email, and company are required."
        });
    }
    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
        return res.status(400).json({
            status: "error",
            message: "Please provide a valid email address."
        });
    }
    // Generate the next customer ID
    const newId = Math.max(0, ...customers_1.customers.map((customer) => customer.id)) + 1;
    // Create the customer record
    const newCustomer = {
        id: newId,
        name: name.trim(),
        email: email.trim(),
        company: company.trim()
    };
    // Store the new customer in the array
    customers_1.customers.push(newCustomer);
    // Return the created customer
    return res.status(201).json({
        status: "success",
        message: "Customer created successfully.",
        data: newCustomer
    });
});
// GET: Retrieve all customers
exports.customerRouter.get("/", (_req, res) => {
    return res.status(200).json({
        status: "success",
        results: customers_1.customers.length,
        data: customers_1.customers
    });
});
// GET: Retrieve one customer by ID
exports.customerRouter.get("/:id", (req, res) => {
    const customerId = Number(req.params.id);
    if (!Number.isInteger(customerId) || customerId <= 0) {
        return res.status(400).json({
            status: "error",
            message: "Invalid customer ID."
        });
    }
    const customer = customers_1.customers.find((customer) => customer.id === customerId);
    if (!customer) {
        return res.status(404).json({
            status: "error",
            message: "Customer not found."
        });
    }
    return res.status(200).json({
        status: "success",
        data: customer
    });
});
