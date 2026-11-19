export interface Customer {
  id: number;
  name: string;
  email: string;
  company: string;
}

// Structure returned by JSONPlaceholder (kept for compatibility if used elsewhere).
export interface ApiUser {
  id: number;
  name: string;
  email: string;
  company: {
    name: string;
  };
}

export type TicketStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed";

export type TicketPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent";

export interface Ticket {
  id: number;
  customer_id: number;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}