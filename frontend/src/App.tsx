
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

  // Store the selected company filter
  const [selectedCompany, setSelectedCompany] =
    useState("All Companies");

  // Filter customers based on name or email

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


  // Clear the search field
  function handleClearFilters() {
    setSearchTerm("");
    setSelectedCompany("All Companies");
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

        <select
          value={selectedCompany}
          onChange={(event) => setSelectedCompany(event.target.value)}
        >
          <option value="All Companies">All Companies</option>
          <option value="Romaguera-Crona">Romaguera-Crona</option>
          <option value="Deckow-Crist">Deckow-Crist</option>
          <option value="Romaguera-Jacobson">Romaguera-Jacobson</option>
        </select>

        <button onClick={handleClearFilters}>
          Clear Filters
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
