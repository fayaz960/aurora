import pg from "pg";

const { Pool } = pg;

// All connection details come from environment variables.
// This is a core DevOps principle: never hardcode config or secrets in code.
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "aurora",
  password: process.env.DB_PASSWORD || "aurora",
  database: process.env.DB_NAME || "aurora",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on("error", (err) => {
  console.error("Unexpected database pool error:", err.message);
});

export const query = (text, params) => pool.query(text, params);
export default pool;
