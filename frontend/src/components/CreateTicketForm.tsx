import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Customer, TicketPriority } from "../types";

interface CreateTicketFormProps {
  customers: Customer[];
  onCreateTicket: (ticket: {
    customer_id: number;
    subject: string;
    description: string;
    priority: TicketPriority;
  }) => Promise<void>;
}

export function CreateTicketForm({
  customers,
  onCreateTicket
}: CreateTicketFormProps) {
  const [customerId, setCustomerId] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] =
    useState<TicketPriority>("medium");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // If the selected customer is deleted, clear the now-invalid selection.
  useEffect(() => {
    if (
      customerId &&
      !customers.some((customer) => customer.id === Number(customerId))
    ) {
      setCustomerId("");
    }
  }, [customers, customerId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!customerId) {
      setError("Please select a customer.");
      return;
    }

    try {
      setSubmitting(true);

      await onCreateTicket({
        customer_id: Number(customerId),
        subject: subject.trim(),
        description: description.trim(),
        priority
      });

      setCustomerId("");
      setSubject("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create support ticket."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="ticket-form-section">
      <h2>Create Support Ticket</h2>

      <form onSubmit={handleSubmit}>
        <select
          value={customerId}
          onChange={(event) => setCustomerId(event.target.value)}
          required
          disabled={customers.length === 0 || submitting}
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} — {customer.email}
            </option>
          ))}
        </select>

        {customers.length === 0 && (
          <p className="error-message">
            No customers available. Add a customer before creating a ticket.
          </p>
        )}

        <input
          type="text"
          placeholder="Ticket Subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          maxLength={180}
          required
          disabled={customers.length === 0 || submitting}
        />

        <textarea
          placeholder="Describe the customer's issue..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          disabled={customers.length === 0 || submitting}
        />

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as TicketPriority)
          }
          disabled={customers.length === 0 || submitting}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <button
          type="submit"
          disabled={submitting || customers.length === 0}
        >
          {submitting ? "Creating..." : "Create Ticket"}
        </button>
      </form>

      {error && (
        <p className="error-message">{error}</p>
      )}
    </section>
  );
}
