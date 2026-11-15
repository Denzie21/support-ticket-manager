
import type { Customer } from "../types";

interface CustomerDetailsProps {
  customer: Customer;
}

export function CustomerDetails({
  customer
}: CustomerDetailsProps) {
  return (
    <section className="customer-details">
      <h2>Customer Details</h2>

      <p>
        <strong>Customer ID:</strong> {customer.id}
      </p>

      <p>
        <strong>Name:</strong> {customer.name}
      </p>

      <p>
        <strong>Email:</strong> {customer.email}
      </p>

      <p>
        <strong>Company:</strong> {customer.company}
      </p>
    </section>
  );
}
