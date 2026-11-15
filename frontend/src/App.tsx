import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { CustomerCard } from "./components/CustomerCard";
import type { Customer } from "./types";
import { CustomerDetails } from "./components/CustomerDetails";

import "./App.css";

function App() {
  // Store customer records
  const [customers, setCustomers] = useState<Customer[]>([]);

  // API loading state
  const [loading, setLoading] = useState(true);

  // API error state
  const [error, setError] = useState("");

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Company filter state
  const [selectedCompany, setSelectedCompany] =
    useState("All Companies");

  // New customer form state
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    company: ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [detailsError, setDetailsError] =
    useState("");


  // Fetch customers from our Express backend
  useEffect(() => {
    async function fetchCustomers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/customers"
        );

        if (!response.ok) {
          throw new Error("Failed to retrieve customers from backend.");
        }

        const result: {
          status: string;
          results: number;
          data: Customer[];
        } = await response.json();

        setCustomers(result.data);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);



  // Retrieve individual customer details from our Express backend
  async function handleViewDetails(customerId: number) {
    try {
      setDetailsLoading(true);
      setDetailsError("");
      setSelectedCustomer(null);

      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`
      );

      if (!response.ok) {
        throw new Error(
          "Customer details could not be retrieved."
        );
      }

      const result: {
        status: string;
        data: Customer;
      } = await response.json();

      setSelectedCustomer(result.data);

    } catch (err) {
      setDetailsError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setDetailsLoading(false);
    }
  }


  // Add a new customer through our Express backend
  async function handleAddCustomer(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: newCustomer.name.trim(),
            email: newCustomer.email.trim(),
            company: newCustomer.company.trim()
          })
        }
      );

      const result: {
        status: string;
        message: string;
        data: Customer;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to create customer."
        );
      }

      // Add the customer returned by the backend
      setCustomers((previousCustomers) => [
        ...previousCustomers,
        result.data
      ]);

      // Reset the form
      setNewCustomer({
        name: "",
        email: "",
        company: ""
      });

      // Reset search and company filters
      setSearchTerm("");
      setSelectedCompany("All Companies");

      setSubmitSuccess("Customer created successfully!");

    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setSubmitting(false);
    }
  }


  // Generate company options from customer data
  const companies = [
    ...new Set(customers.map((customer) => customer.company))
  ];

  // Search and filter customers
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search);

    const matchesCompany =
      selectedCompany === "All Companies" ||
      customer.company === selectedCompany;

    return matchesSearch && matchesCompany;
  });

  // Clear filters
  function handleClearFilters() {
    setSearchTerm("");
    setSelectedCompany("All Companies");
  }

  return (
    <main className="app">

      <header className="page-header">
        <p className="eyebrow">
          CUSTOMER SUPPORT TICKET MANAGER
        </p>

        <h1>Customer Directory</h1>

        <p>
          Manage and review customer information.
        </p>
      </header>

      {/* CREATE CUSTOMER FORM */}
      <section className="form-section">
        <h2>Add New Customer</h2>

        <form onSubmit={handleAddCustomer}>
          <input
            type="text"
            placeholder="Customer Name"
            value={newCustomer.name}
            onChange={(event) =>
              setNewCustomer({
                ...newCustomer,
                name: event.target.value
              })
            }
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={newCustomer.email}
            onChange={(event) =>
              setNewCustomer({
                ...newCustomer,
                email: event.target.value
              })
            }
            required
          />

          <input
            type="text"
            placeholder="Company Name"
            value={newCustomer.company}
            onChange={(event) =>
              setNewCustomer({
                ...newCustomer,
                company: event.target.value
              })
            }
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? "Adding..." : "Add Customer"}
          </button>
        </form>
        {submitError && (
  <p className="error-message">
    {submitError}
  </p>
)}

{submitSuccess && (
  <p className="success-message">
    {submitSuccess}
  </p>
)}
      </section>

      {/* SEARCH AND FILTER */}
      <section className="search-section">
        <input
          type="text"
          placeholder="Search customer name or email..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <select
          value={selectedCompany}
          onChange={(event) =>
            setSelectedCompany(event.target.value)
          }
        >
          <option value="All Companies">All Companies</option>

          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <button onClick={handleClearFilters}>
          Clear Filters
        </button>
      </section>

      {/* CUSTOMER DIRECTORY */}
      <section className="customer-grid">

        {loading ? (
          <p>Loading customers from API...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (

            <CustomerCard
              key={customer.id}
              customer={customer}
              onViewDetails={handleViewDetails}
            />

          ))
        ) : (
          <p>No customers found.</p>
        )}

      </section>

      {detailsLoading && (
        <p>Loading customer details...</p>
      )}

      {detailsError && (
        <p className="error-message">{detailsError}</p>
      )}

      {selectedCustomer && (
        <CustomerDetails customer={selectedCustomer} />
      )}

      {!loading && !error && (
        <p className="result-count">
          Showing {filteredCustomers.length} of {customers.length} customers
        </p>
      )}


    </main>
  );
}

export default App;
