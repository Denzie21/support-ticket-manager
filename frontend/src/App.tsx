import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { CustomerCard } from "./components/CustomerCard";
import { CustomerDetails } from "./components/CustomerDetails";
import { TicketCard } from "./components/TicketCard";
import { CreateTicketForm } from "./components/CreateTicketForm";
import { TicketDetails } from "./components/TicketDetails";
import { DashboardAnalytics } from "./components/DashboardAnalytics";

import type {
  Customer,
  Ticket,
  TicketStatus,
  TicketPriority
} from "./types";

import "./App.css";

function App() {
  // ==========================================
  // CUSTOMER STATES
  // ==========================================

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerActionError, setCustomerActionError] = useState("");
  const [customerActionSuccess, setCustomerActionSuccess] = useState("");
  const [deletingCustomerId, setDeletingCustomerId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");

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

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // ==========================================
  // TICKET STATES
  // ==========================================

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState("");

  const [selectedTicket, setSelectedTicket] =
    useState<Ticket | null>(null);

  const [ticketDetailsLoading, setTicketDetailsLoading] = useState(false);
  const [ticketDetailsError, setTicketDetailsError] = useState("");

  const [ticketActionError, setTicketActionError] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState("");

  // ==========================================
  // FETCH CUSTOMERS
  // ==========================================

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

  // ==========================================
  // FETCH SUPPORT TICKETS
  // ==========================================

  useEffect(() => {
    async function fetchTickets() {
      try {
        setTicketsLoading(true);
        setTicketsError("");

        const response = await fetch(
          "http://localhost:5000/api/tickets",
          {
            method: "GET",
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache"
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to retrieve support tickets from backend.");
        }

        const result: {
          status: string;
          results: number;
          data: Ticket[];
        } = await response.json();

        setTickets(result.data);
      } catch (err) {
        setTicketsError(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred."
        );
      } finally {
        setTicketsLoading(false);
      }
    }

    fetchTickets();
  }, []);

  // ==========================================
  // VIEW CUSTOMER DETAILS
  // ==========================================

  async function handleViewDetails(customerId: number) {
    try {
      setDetailsLoading(true);
      setDetailsError("");
      setSelectedCustomer(null);

      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`
      );

      if (!response.ok) {
        throw new Error("Customer details could not be retrieved.");
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

  // ==========================================
  // ADD CUSTOMER
  // ==========================================

  async function handleAddCustomer(event: FormEvent<HTMLFormElement>) {
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
        throw new Error(result.message || "Failed to create customer.");
      }

      setCustomers((previousCustomers) => [
        ...previousCustomers,
        result.data
      ]);

      setNewCustomer({
        name: "",
        email: "",
        company: ""
      });

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

  // ==========================================
  // DELETE CUSTOMER AND ASSOCIATED TICKETS
  // ==========================================

  async function handleDeleteCustomer(
    customerId: number,
    customerName: string
  ): Promise<void> {
    const confirmed = window.confirm(
      `Delete ${customerName} and all of their support tickets? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingCustomerId(customerId);
      setCustomerActionError("");
      setCustomerActionSuccess("");

      const response = await fetch(
        `http://localhost:5000/api/customers/${customerId}`,
        {
          method: "DELETE"
        }
      );

      const result: {
        status: string;
        message: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete customer.");
      }

      // Remove the customer and their tickets from the current dashboard.
      setCustomers((previousCustomers) =>
        previousCustomers.filter(
          (customer) => customer.id !== customerId
        )
      );

      setTickets((previousTickets) =>
        previousTickets.filter(
          (ticket) => ticket.customer_id !== customerId
        )
      );

      // Close details panels only when they belong to this customer.
      setSelectedCustomer((previousCustomer) =>
        previousCustomer?.id === customerId ? null : previousCustomer
      );

      setSelectedTicket((previousTicket) =>
        previousTicket?.customer_id === customerId ? null : previousTicket
      );

      setCustomerActionSuccess(
        `${customerName} and their associated support tickets were deleted successfully.`
      );
    } catch (err) {
      setCustomerActionError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setDeletingCustomerId(null);
    }
  }

  // ==========================================
  // CREATE SUPPORT TICKET
  // ==========================================

  async function handleCreateTicket(ticketData: {
    customer_id: number;
    subject: string;
    description: string;
    priority: TicketPriority;
  }): Promise<void> {
    setTicketActionError("");
    setTicketSuccess("");

    const response = await fetch(
      "http://localhost:5000/api/tickets",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ticketData)
      }
    );

    const result: {
      status: string;
      message: string;
      data: Ticket;
    } = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to create support ticket."
      );
    }

    setTickets((previousTickets) => [
      result.data,
      ...previousTickets
    ]);

    setTicketSuccess("Support ticket created successfully!");
  }

  // ==========================================
  // VIEW TICKET DETAILS
  // ==========================================

  async function handleViewTicket(ticketId: number) {
    try {
      setTicketDetailsLoading(true);
      setTicketDetailsError("");
      setSelectedTicket(null);

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`
      );

      if (!response.ok) {
        throw new Error("Support ticket details could not be retrieved.");
      }

      const result: {
        status: string;
        data: Ticket;
      } = await response.json();

      setSelectedTicket(result.data);
    } catch (err) {
      setTicketDetailsError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    } finally {
      setTicketDetailsLoading(false);
    }
  }

  // ==========================================
  // UPDATE TICKET STATUS OR PRIORITY
  // ==========================================

  async function handleUpdateTicket(
    ticketId: number,
    updates: {
      status?: TicketStatus;
      priority?: TicketPriority;
    }
  ): Promise<void> {
    try {
      setTicketActionError("");
      setTicketSuccess("");

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updates)
        }
      );

      const result: {
        status: string;
        message: string;
        data: Ticket;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update support ticket."
        );
      }

      setTickets((previousTickets) =>
        previousTickets.map((ticket) =>
          ticket.id === ticketId ? result.data : ticket
        )
      );

      setSelectedTicket(result.data);
      setTicketSuccess("Support ticket updated successfully!");
    } catch (err) {
      setTicketActionError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    }
  }

  // ==========================================
  // DELETE SUPPORT TICKET
  // ==========================================

  async function handleDeleteTicket(ticketId: number): Promise<void> {
    const confirmed = window.confirm(
      "Are you sure you want to delete this support ticket?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setTicketActionError("");
      setTicketSuccess("");

      const response = await fetch(
        `http://localhost:5000/api/tickets/${ticketId}`,
        {
          method: "DELETE"
        }
      );

      const result: {
        status: string;
        message: string;
      } = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete support ticket."
        );
      }

      setTickets((previousTickets) =>
        previousTickets.filter(
          (ticket) => ticket.id !== ticketId
        )
      );

      setSelectedTicket((previousTicket) =>
        previousTicket?.id === ticketId ? null : previousTicket
      );

      setTicketSuccess("Support ticket deleted successfully!");
    } catch (err) {
      setTicketActionError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );
    }
  }

  // ==========================================
  // CUSTOMER SEARCH AND FILTER
  // ==========================================

  const companies = [
    ...new Set(customers.map((customer) => customer.company))
  ];

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

  function handleClearFilters() {
    setSearchTerm("");
    setSelectedCompany("All Companies");
  }

  // ==========================================
  // APPLICATION UI
  // ==========================================

  return (
    <main className="app">
      {/* PAGE HEADER */}
      <header className="page-header">
        <p className="eyebrow">
          CUSTOMER SUPPORT TICKET MANAGER
        </p>

        <h1>Customer Directory</h1>

        <p>
          Manage customers and support tickets.
        </p>
      </header>
      
      {/* DASHBOARD ANALYTICS */}
      <DashboardAnalytics
        customers={customers}
        tickets={tickets}
      />

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

      {/* CREATE SUPPORT TICKET FORM */}
      <CreateTicketForm
        customers={customers}
        onCreateTicket={handleCreateTicket}
      />

      {/* TICKET SUCCESS AND ERROR MESSAGES */}
      {ticketSuccess && (
        <p className="success-message">
          {ticketSuccess}
        </p>
      )}

      {ticketActionError && (
        <p className="error-message">
          {ticketActionError}
        </p>
      )}

      {/* SUPPORT TICKET DASHBOARD */}
      <section className="ticket-section">
        <h2>Support Tickets</h2>

        {ticketsLoading ? (
          <p>Loading support tickets...</p>
        ) : ticketsError ? (
          <p className="error-message">
            {ticketsError}
          </p>
        ) : tickets.length > 0 ? (
          <div className="ticket-grid">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onViewDetails={handleViewTicket}
              />
            ))}
          </div>
        ) : (
          <p>No support tickets found.</p>
        )}
      </section>

      {/* SELECTED TICKET DETAILS */}
      {ticketDetailsLoading && (
        <p>Loading ticket details...</p>
      )}

      {ticketDetailsError && (
        <p className="error-message">
          {ticketDetailsError}
        </p>
      )}

      {selectedTicket && (
        <TicketDetails
          ticket={selectedTicket}
          onUpdateTicket={handleUpdateTicket}
          onDeleteTicket={handleDeleteTicket}
        />
      )}

      {/* CUSTOMER SEARCH AND FILTER */}
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
          <option value="All Companies">
            All Companies
          </option>

          {companies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={handleClearFilters}
        >
          Clear Filters
        </button>
      </section>

      {/* CUSTOMER DELETE SUCCESS AND ERROR MESSAGES */}
      {customerActionSuccess && (
        <p className="success-message">
          {customerActionSuccess}
        </p>
      )}

      {customerActionError && (
        <p className="error-message">
          {customerActionError}
        </p>
      )}

      {/* CUSTOMER DIRECTORY */}
      <section className="customer-grid">
        {loading ? (
          <p>Loading customers from API...</p>
        ) : error ? (
          <p className="error-message">
            {error}
          </p>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onViewDetails={handleViewDetails}
              onDeleteCustomer={handleDeleteCustomer}
              isDeleting={deletingCustomerId === customer.id}
            />
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </section>

      {/* CUSTOMER DETAILS */}
      {detailsLoading && (
        <p>Loading customer details...</p>
      )}

      {detailsError && (
        <p className="error-message">
          {detailsError}
        </p>
      )}

      {selectedCustomer && (
        <CustomerDetails customer={selectedCustomer} />
      )}

      {/* CUSTOMER RESULT COUNT */}
      {!loading && !error && (
        <p className="result-count">
          Showing {filteredCustomers.length} of {customers.length} customers
        </p>
      )}
    </main>
  );
}

export default App;
