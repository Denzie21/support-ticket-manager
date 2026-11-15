
import type { Customer } from "../types";

interface CustomerCardProps {
  customer: Customer;
  onViewDetails: (customerId: number) => void;
}

export function CustomerCard({
  customer,
  onViewDetails
}: CustomerCardProps) {
  return (
    <article className="customer-card">
      <div className="avatar">
        {customer.name.charAt(0)}
      </div>

      <div className="customer-info">
        <h2>{customer.name}</h2>

        <p>{customer.email}</p>

        <p className="company">
          Company: {customer.company}
        </p>

        <button
          onClick={() => onViewDetails(customer.id)}
        >
          View Details
        </button>
      </div>
    </article>
  );
}
