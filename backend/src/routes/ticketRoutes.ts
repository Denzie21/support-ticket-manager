import { Router } from "express";
import { pool } from "../config/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { Ticket, TicketStatus, TicketPriority } from "../types/Ticket";

export const ticketRouter = Router();

// Represents a ticket record returned by MySQL
interface TicketRow extends RowDataPacket, Ticket { }

//POST route
ticketRouter.post("/", async (req, res) => {
  const {
    customer_id,
    subject,
    description,
    status,
    priority
  } = req.body;


  // 1. Validate customer ID
  if (
    typeof customer_id !== "number" ||
    !Number.isInteger(customer_id) ||
    customer_id <= 0
  ) {
    return res.status(400).json({
      status: "error",
      message: "A valid customer ID is required."
    });
  }

  // 2. Validate subject and description
  if (
    typeof subject !== "string" ||
    !subject.trim() ||
    subject.trim().length > 180 ||
    typeof description !== "string" ||
    !description.trim()
  ) {
    return res.status(400).json({
      status: "error",
      message: "A valid subject and description are required."
    });
  }

  // 3. Define allowed status and priority values
  const validStatuses: TicketStatus[] = [
    "open",
    "in_progress",
    "resolved",
    "closed"
  ];

  const validPriorities: TicketPriority[] = [
    "low",
    "medium",
    "high",
    "urgent"
  ];

  // 4. Validate optional status
  if (
    status !== undefined &&
    (typeof status !== "string" ||
      !validStatuses.includes(status as TicketStatus))
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ticket status."
    });
  }

  // 5. Validate optional priority
  if (
    priority !== undefined &&
    (typeof priority !== "string" ||
      !validPriorities.includes(priority as TicketPriority))
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ticket priority."
    });
  }

  // 6. Apply default values
  const ticketStatus: TicketStatus = status ?? "open";
  const ticketPriority: TicketPriority = priority ?? "medium";

  try {
    // 7. Check whether the customer exists
    const [customers] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM customers WHERE id = ?",
      [customer_id]
    );

    if (customers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found."
      });
    }

    // 8. Insert ticket into MySQL
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO tickets
       (customer_id, subject, description, status, priority)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer_id,
        subject.trim(),
        description.trim(),
        ticketStatus,
        ticketPriority
      ]
    );

    // 9. Retrieve the newly created ticket
    const [rows] = await pool.execute<TicketRow[]>(
      `SELECT id, customer_id, subject, description,
              status, priority, created_at, updated_at
       FROM tickets
       WHERE id = ?`,
      [result.insertId]
    );

    // 10. Return the created ticket
    return res.status(201).json({
      status: "success",
      message: "Support ticket created successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Ticket creation failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to create support ticket."
    });
  }
});

// GET:route — outside the POST handler 
// Retrieve all support tickets
ticketRouter.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.execute<TicketRow[]>(
      `SELECT
        id,
        customer_id,
        subject,
        description,
        status,
        priority,
        created_at,
        updated_at
       FROM tickets
       ORDER BY id DESC`
    );

    return res.status(200).json({
      status: "success",
      results: rows.length,
      data: rows
    });

  } catch (error) {
    console.error("Retrieving tickets failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to retrieve support tickets."
    });
  }
});
// GET: Retrieve a single support ticket by ID
ticketRouter.get("/:id", async (req, res) => {
  const ticketId = Number(req.params.id);

  // 1. Validate ticket ID
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    return res.status(400).json({
      status: "error",
      message: "A valid ticket ID is required."
    });
  }

  try {
    // 2. Find ticket in MySQL
    const [rows] = await pool.execute<TicketRow[]>(
      `SELECT
        id,
        customer_id,
        subject,
        description,
        status,
        priority,
        created_at,
        updated_at
       FROM tickets
       WHERE id = ?`,
      [ticketId]
    );

    // 3. Check whether ticket exists
    if (rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Support ticket not found."
      });
    }

    // 4. Return ticket details
    return res.status(200).json({
      status: "success",
      data: rows[0]
    });

  } catch (error) {
    console.error("Retrieving ticket failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to retrieve support ticket."
    });
  }
});

// PATCH: Update ticket status and priority
ticketRouter.patch("/:id", async (req, res) => {
  const ticketId = Number(req.params.id);
  const { status, priority } = req.body;

  // 1. Validate ticket ID
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    return res.status(400).json({
      status: "error",
      message: "A valid ticket ID is required."
    });
  }

  // 2. Define allowed values
  const validStatuses: TicketStatus[] = [
    "open",
    "in_progress",
    "resolved",
    "closed"
  ];

  const validPriorities: TicketPriority[] = [
    "low",
    "medium",
    "high",
    "urgent"
  ];

  // 3. Require at least one field to update
  if (status === undefined && priority === undefined) {
    return res.status(400).json({
      status: "error",
      message: "Provide a status or priority to update."
    });
  }

  // 4. Validate status
  if (
    status !== undefined &&
    (typeof status !== "string" ||
      !validStatuses.includes(status as TicketStatus))
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ticket status."
    });
  }

  // 5. Validate priority
  if (
    priority !== undefined &&
    (typeof priority !== "string" ||
      !validPriorities.includes(priority as TicketPriority))
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid ticket priority."
    });
  }

  try {
    // 6. Check whether ticket exists
    const [existingTickets] = await pool.execute<TicketRow[]>(
      "SELECT id FROM tickets WHERE id = ?",
      [ticketId]
    );

    if (existingTickets.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Support ticket not found."
      });
    }

    // 7. Update supplied fields only
    await pool.execute(
      `UPDATE tickets
       SET status = COALESCE(?, status),
           priority = COALESCE(?, priority)
       WHERE id = ?`,
      [
        status === undefined ? null : status,
        priority === undefined ? null : priority,
        ticketId
      ]
    );

    // 8. Retrieve updated ticket
    const [rows] = await pool.execute<TicketRow[]>(
      `SELECT
        id,
        customer_id,
        subject,
        description,
        status,
        priority,
        created_at,
        updated_at
       FROM tickets
       WHERE id = ?`,
      [ticketId]
    );

    return res.status(200).json({
      status: "success",
      message: "Support ticket updated successfully.",
      data: rows[0]
    });

  } catch (error) {
    console.error("Ticket update failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to update support ticket."
    });
  }
});

// DELETE: Remove a support ticket by ID
ticketRouter.delete("/:id", async (req, res) => {
  console.log("DELETE request received:", req.params.id);
  const ticketId = Number(req.params.id);

  // 1. Validate ticket ID
  if (!Number.isInteger(ticketId) || ticketId <= 0) {
    return res.status(400).json({
      status: "error",
      message: "A valid ticket ID is required."
    });
  }

  try {
    // 2. Check whether ticket exists
    const [existingTickets] = await pool.execute<TicketRow[]>(
      "SELECT id FROM tickets WHERE id = ?",
      [ticketId]
    );

    if (existingTickets.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Support ticket not found."
      });
    }

    // 3. Delete ticket from MySQL
    await pool.execute(
      "DELETE FROM tickets WHERE id = ?",
      [ticketId]
    );
    console.log("Ticket successfully deleted from MySQL:", ticketId);

    // 4. Return successful response
    return res.status(200).json({
      status: "success",
      message: "Support ticket deleted successfully.",
      data: {
        id: ticketId
      }
    });

  } catch (error) {
    console.error("Ticket deletion failed:", error);

    return res.status(500).json({
      status: "error",
      message: "Unable to delete support ticket."
    });
  }
});

