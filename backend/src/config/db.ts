
import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Load environment variables from backend/.env
dotenv.config();

// Check that required database settings are available
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_PASSWORD || !DB_NAME) {
  throw new Error(
    "Database configuration is incomplete. Check your backend .env file."
  );
}

// Create a reusable MySQL connection pool
export const pool = mysql.createPool({
  host: DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log("MySQL connection pool configured.");
