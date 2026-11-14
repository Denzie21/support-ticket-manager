
import { CustomerCard } from "./components/CustomerCard";
import type { Customer } from "./types";
import "./App.css";

// Sample customer data
const customers: Customer[] = [
  {
    id: 1,
    name: "Leanne Graham",
    email: "Sincere@april.biz",
    company: "Romaguera-Crona"
  },
  {
    id: 2,
    name: "Ervin Howell",
    email: "Shanna@melissa.tv",
    company: "Deckow-Crist"
  },
  {
    id: 3,
    name: "Clementine Bauch",
    email: "Nathan@yesenia.net",
    company: "Romaguera-Jacobson"
  }
];

// Main React component
function App() {

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

      <section className="customer-grid">

        {customers.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
          />
        ))}

      </section>

      <p className="result-count">
        Showing {customers.length} customers
      </p>

    </main>
  );
}

export default App;
