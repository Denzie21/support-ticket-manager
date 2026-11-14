
import { useState } from "react";
import { CustomerCard } from "./components/CustomerCard";
import type { Customer } from "./types";
import "./App.css";

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

function App() {
  // Store the user's search input
  const [searchTerm, setSearchTerm] = useState("");

  // Filter customers based on name or email
  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase();

    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search)
    );
  });

  // Clear the search field
  function handleClearSearch() {
    setSearchTerm("");
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

      <section className="search-section">
        <input
          type="text"
          placeholder="Search customer name or email..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        <button onClick={handleClearSearch}>
          Clear Search
        </button>
      </section>

      <section className="customer-grid">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
            />
          ))
        ) : (
          <p>No customers found.</p>
        )}
      </section>

      <p className="result-count">
        Showing {filteredCustomers.length} of {customers.length} customers
      </p>

    </main>
  );
}

export default App;
