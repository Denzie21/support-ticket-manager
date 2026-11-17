# Customer Support Ticket Manager

A full-stack web application built to manage customer records and support tickets. This project demonstrates practical development skills using React, TypeScript, Node.js, Express.js, MySQL, and Docker.

## Project Overview

The Customer Support Ticket Manager provides a centralized interface for managing customer information and tracking customer support issues.

Users can create and view customer records, create support tickets, monitor ticket status and priority, and update or delete tickets through a React frontend connected to a RESTful API and MySQL database.

## Features

### Customer Management
- Create new customer records.
- View customer information and details.
- Retrieve customer records from the backend.
- Search customers by name or email.
- Filter customers by company.
- Prevent duplicate customer email addresses through backend validation.

### Support Ticket Management
- Create support tickets for existing customers.
- View all support tickets.
- Retrieve individual ticket details.
- Update ticket status.
- Update ticket priority.
- Delete support tickets.
- Associate support tickets with customers using customer IDs.

### Ticket Status Options
- Open
- In Progress
- Resolved
- Closed

### Ticket Priority Options
- Low
- Medium
- High
- Urgent

### Application Interface
- Responsive dashboard layout.
- Customer and ticket cards.
- Form validation and error messages.
- Loading and success messages.
- User-friendly navigation through the application interface.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type-safe application development |
| Vite | Frontend development and build tooling |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MySQL | Relational database |
| Docker | MySQL container environment |
| CSS | Application styling |
| Git and GitHub | Version control and source code management |

## Application Architecture

The application follows a frontend-backend-database architecture.

```text
React + TypeScript
       |
       | HTTP Requests
       v
Node.js + Express.js
       |
       | SQL Queries
       v
     MySQL
       |
       v
Customer and Ticket Records
```

## Project Structure

```text
support-ticket-manager/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   └── testConnection.ts
│   │   │
│   │   ├── routes/
│   │   │   ├── customerRoutes.ts
│   │   │   └── ticketRoutes.ts
│   │   │
│   │   ├── types/
│   │   │   └── Ticket.ts
│   │   │
│   │   └── server.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerCard.tsx
│   │   │   ├── CustomerDetails.tsx
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketDetails.tsx
│   │   │   └── CreateTicketForm.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── types.ts
│   │
│   └── package.json
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## REST API Endpoints

The backend exposes REST API endpoints for customer and support ticket management.

### Customer Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/customers` | Retrieve all customers |
| GET | `/api/customers/:id` | Retrieve a customer by ID |
| POST | `/api/customers` | Create a new customer |

### Ticket Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tickets` | Retrieve all support tickets |
| GET | `/api/tickets/:id` | Retrieve a ticket by ID |
| POST | `/api/tickets` | Create a support ticket |
| PATCH | `/api/tickets/:id` | Update ticket status or priority |
| DELETE | `/api/tickets/:id` | Delete a support ticket |

## Local Development Setup

### Prerequisites

Install the following tools before running the application:

- Node.js and npm
- MySQL 8.4
- Docker Desktop
- Git
- Visual Studio Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/support-ticket-manager.git

cd support-ticket-manager
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username.

### 2. Start the MySQL Container

From the project root:

```bash
docker compose up -d
```

Check the container status:

```bash
docker compose ps
```

Wait until the MySQL container reports a healthy status.

### 3. Configure Backend Environment Variables

Create the backend environment configuration file:

```text
backend/.env
```

Configure the MySQL connection using the environment variable names expected by `backend/src/config/db.ts`.

Do not upload your actual database passwords or secrets to GitHub.

### 4. Install Backend Dependencies

```bash
cd backend

npm install
```

Start the backend development server:

```bash
npm run dev
```

The backend API runs at:

```text
http://localhost:5000
```

Health check endpoint:

```text
http://localhost:5000/api/health
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend

npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

## Build Verification

The frontend production build can be checked using:

```bash
cd frontend

npm run build
```

The backend TypeScript build can be checked using:

```bash
cd backend

npm run build
```

Both builds have been successfully verified during development.

## Testing and Verification

The following application functionality has been implemented and tested during development:

- Customer creation and retrieval.
- Customer search and company filtering.
- Customer details retrieval.
- Support ticket creation.
- Support ticket retrieval.
- Ticket status updates.
- Ticket priority updates.
- Support ticket deletion.
- MySQL database persistence.
- Frontend production build.
- Backend TypeScript compilation.

## Project Purpose

This project was developed as a practical full-stack portfolio project to strengthen my understanding of modern web application development.

It demonstrates my ability to work with frontend components, TypeScript interfaces, REST API integration, backend routing, SQL database operations, application validation, and Docker-based database environments.

## Future Improvements

Potential enhancements include:

- User authentication and authorization.
- Role-based access control.
- Ticket assignment to support agents.
- Dashboard analytics and reporting.
- Pagination and advanced ticket filtering.
- Automated testing.
- Production deployment.

## Author

**Dennis S. Aguilar**

Aspiring Full-Stack Developer

Technical Interests:
- React and TypeScript
- Node.js and Express.js
- MySQL and Database Management
- REST API Development
- Frontend and Backend Integration

GitHub: https://github.com/YOUR-GITHUB-USERNAME

---

*This project is part of my professional software development portfolio.*