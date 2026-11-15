import { pool } from "./db";

async function testConnection() {
  try {
    const connection = await pool.getConnection();

    console.log("Successfully connected to MySQL!");

    const [rows] = await connection.query(
      "SELECT DATABASE() AS databaseName, VERSION() AS version"
    );

    console.log("Database information:", rows);

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error);
  } finally {
    await pool.end();
  }
}

testConnection();