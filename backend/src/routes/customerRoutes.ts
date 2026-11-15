
import { Router } from "express";
import { pool } from "../config/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

interface CustomerRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  company: string;
}

export const customerRouter = Router();


// POST: Create a new customer using MySQL
customerRouter.post("/", async (req, res) => {
  const { name, email, company } = req.body;

  // Validate required fields
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof company !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !company.trim()
  ) {
    return res.status(400).json({
      status: "error",
      message: "Name, email, and company are required."
    });
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid email address."
    });
  }

  try {
    // Insert customer into MySQL
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO customers (name, email, company)
       VALUES (?, ?, ?)`,
      [
        name.trim(),
        email.trim(),
        company.trim()
      ]
    );

    // Construct the newly created customer
    const newCustomer = {
      id: result.insertId,
      name: name.trim(),
      email: email.trim(),
      company: company.trim()
    };

    // Return successful response
    return res.status(201).json({
      status: "success",
      message: "Customer created successfully.",
      data: newCustomer
    });

  } catch (error) {
    const databaseError = error as { code?: string };

    // Handle duplicate email
    if (databaseError.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        status: "error",
        message: "A customer with this email already exists."
      });
    }

    console.error("Customer creation failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to create customer."
    });
  }
});


// GET: Retrieve all customers from MySQL
customerRouter.get("/", async (_req, res) => {
  try {
    // Retrieve all customer records from MySQL
    const [rows] = await pool.execute<CustomerRow[]>(
      `SELECT id, name, email, company
       FROM customers
       ORDER BY id ASC`
    );

    // Return all customers
    return res.status(200).json({
      status: "success",
      results: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Failed to retrieve customers:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to retrieve customers."
    });
  }
});

// GET: Retrieve one customer by ID from MySQL
customerRouter.get("/:id", async (req, res) => {
  const customerId = Number(req.params.id);

  // Validate customer ID
  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Invalid customer ID."
    });
  }

  try {
    // Retrieve customer from MySQL
    const [rows] = await pool.execute<CustomerRow[]>(
      `SELECT id, name, email, company
       FROM customers
       WHERE id = ?`,
      [customerId]
    );

    // Check whether customer exists
    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found."
      });
    }

    // Return customer information
    return res.status(200).json({
      status: "success",
      data: rows[0]
    });

  } catch (error) {
    console.error("Failed to retrieve customer:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to retrieve customer."
    });
  }
});
