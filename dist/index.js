"use strict";
async function getAllCustomers() {
    try {
        console.log("Retrieving all customers...");
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        const customers = await response.json();
        console.log("Total Customers:", customers.length);
        console.log("\n===== CUSTOMER DIRECTORY =====");
        customers.forEach((customer) => {
            console.log("----------------------------");
            console.log("Customer ID:", customer.id);
            console.log("Name:", customer.name);
            console.log("Email:", customer.email);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("API Error:", error.message);
        }
        else {
            console.error("An unexpected error occurred.");
        }
    }
}
getAllCustomers();
async function getCustomerById(id) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) {
            throw new Error(`Customer not found: ${response.status}`);
        }
        const customer = await response.json();
        console.log("Customer Found:", customer.name);
        console.log("Email:", customer.email);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
    }
}
getCustomerById(3);
