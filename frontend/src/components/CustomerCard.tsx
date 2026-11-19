import type { Customer } from "../types";

interface CustomerCardProps {
  customer: Customer;
  onViewDetails: (customerId: number) => void;
  onDeleteCustomer: (
    customerId: number,
    customerName: string
  ) => void;
  isDeleting: boolean;
}

export function CustomerCard({
  customer,
  onViewDetails,
  onDeleteCustomer,
  isDeleting
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
          type="button"
          onClick={() => onViewDetails(customer.id)}
        >
          View Details
        </button>

        <button
          type="button"
          disabled={isDeleting}
          onClick={() =>
            onDeleteCustomer(customer.id, customer.name)
          }
        >
          {isDeleting ? "Deleting..." : "Delete Customer"}
        </button>
      </div>
    </article>
  );
}
