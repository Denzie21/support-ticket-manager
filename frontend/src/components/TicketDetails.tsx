
import type {
  Ticket,
  TicketStatus,
  TicketPriority
} from "../types";

interface TicketDetailsProps {
  ticket: Ticket;
  onUpdateTicket: (
    ticketId: number,
    updates: {
      status?: TicketStatus;
      priority?: TicketPriority;
    }
  ) => Promise<void>;
  onDeleteTicket: (ticketId: number) => Promise<void>;
}

export function TicketDetails({
  ticket,
  onUpdateTicket,
  onDeleteTicket
}: TicketDetailsProps) {
  return (
    <section className="ticket-details">
      <h2>Ticket Details</h2>

      <h3>{ticket.subject}</h3>

      <p>{ticket.description}</p>

      <p>
        <strong>Ticket ID:</strong> {ticket.id}
      </p>

      <p>
        <strong>Customer ID:</strong> {ticket.customer_id}
      </p>

      <p>
        <strong>Created:</strong>{" "}
        {new Date(ticket.created_at).toLocaleString()}
      </p>

      <div>
        <label htmlFor="ticket-status">
          Ticket Status
        </label>

        <select
          id="ticket-status"
          value={ticket.status}
          onChange={(event) =>
            onUpdateTicket(ticket.id, {
              status: event.target.value as TicketStatus
            })
          }
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div>
        <label htmlFor="ticket-priority">
          Ticket Priority
        </label>

        <select
          id="ticket-priority"
          value={ticket.priority}
          onChange={(event) =>
            onUpdateTicket(ticket.id, {
              priority: event.target.value as TicketPriority
            })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <button
        type="button"
        onClick={() => onDeleteTicket(ticket.id)}
      >
        Delete Ticket
      </button>
    </section>
  );
}
