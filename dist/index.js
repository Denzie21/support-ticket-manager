"use strict";
// STEP 1: Retrieve all customers
async function getAllCustomers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }
    const customers = await response.json();
    return customers;
}
// STEP 2: Search customers by name, username, or email
function searchCustomers(customers, searchTerm) {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
        return customers;
    }
    return customers.filter((customer) => customer.name.toLowerCase().includes(term) ||
        customer.username.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term));
}
// STEP 3: Filter customers by company
function filterByCompany(customers, companyName) {
    return customers.filter((customer) => customer.company.name.toLowerCase() ===
        companyName.trim().toLowerCase());
}
// STEP 4: Sort customers alphabetically
function sortCustomersByName(customers) {
    return [...customers].sort((a, b) => a.name.localeCompare(b.name));
}
// STEP 5: Display customer information
function displayCustomers(customers) {
    if (customers.length === 0) {
        console.log("No matching customers found.");
        return;
    }
    customers.forEach((customer) => {
        console.log("--------------------------");
        console.log("ID:", customer.id);
        console.log("Name:", customer.name);
        console.log("Email:", customer.email);
        console.log("Company:", customer.company.name);
    });
}
// STEP 6: Execute the application
async function main() {
    try {
        console.log("Connecting to customer API...");
        const customers = await getAllCustomers();
        console.log("\nTotal customers:", customers.length);
        // Search example
        console.log("\n===== SEARCH CUSTOMERS =====");
        const searchResults = searchCustomers(customers, "leanne");
        displayCustomers(searchResults);
        // Company filter example
        console.log("\n===== FILTER BY COMPANY =====");
        const companyResults = filterByCompany(customers, "Romaguera-Crona");
        displayCustomers(companyResults);
        // Sort example
        console.log("\n===== SORT CUSTOMERS A-Z =====");
        const sortedCustomers = sortCustomersByName(customers);
        displayCustomers(sortedCustomers);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Application Error:", error.message);
        }
        else {
            console.error("Unexpected error occurred.");
        }
    }
}
main();
