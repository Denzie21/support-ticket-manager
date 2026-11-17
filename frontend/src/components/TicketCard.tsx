
import type { Ticket } from "../types";

interface TicketCardProps {
  ticket: Ticket;
  onViewDetails: (ticketId: number) => void;
}

export function TicketCard({
  ticket,
  onViewDetails
}: TicketCardProps) {
  return (
    <article className="ticket-card">
      <div className="ticket-card-header">
        <h3>{ticket.subject}</h3>

        <span className={`ticket-status status-${ticket.status}`}>
          {ticket.status.replace("_", " ")}
        </span>
      </div>

      <p>{ticket.description}</p>

      <div className="ticket-card-meta">
        <span>Priority: {ticket.priority}</span>
        <span>Customer ID: {ticket.customer_id}</span>
      </div>

      <button
        type="button"
        onClick={() => onViewDetails(ticket.id)}
      >
        View Ticket
      </button>
    </article>
  );
}
