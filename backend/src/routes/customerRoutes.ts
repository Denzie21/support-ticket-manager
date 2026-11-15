
import { Router } from "express";
import { customers } from "../data/customers";

export const customerRouter = Router();

// POST: Create a new customer
customerRouter.post("/", (req, res) => {
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

  // Basic email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      status: "error",
      message: "Please provide a valid email address."
    });
  }

  // Generate the next customer ID
  const newId =
    Math.max(0, ...customers.map((customer) => customer.id)) + 1;

  // Create the customer record
  const newCustomer = {
    id: newId,
    name: name.trim(),
    email: email.trim(),
    company: company.trim()
  };

  // Store the new customer in the array
  customers.push(newCustomer);

  // Return the created customer
  return res.status(201).json({
    status: "success",
    message: "Customer created successfully.",
    data: newCustomer
  });
});

// GET: Retrieve all customers
customerRouter.get("/", (_req, res) => {
  return res.status(200).json({
    status: "success",
    results: customers.length,
    data: customers
  });
});

// GET: Retrieve one customer by ID
customerRouter.get("/:id", (req, res) => {
  const customerId = Number(req.params.id);

  if (!Number.isInteger(customerId) || customerId <= 0) {
    return res.status(400).json({
      status: "error",
      message: "Invalid customer ID."
    });
  }

  const customer = customers.find(
    (customer) => customer.id === customerId
  );

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
