const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected successfully");
});

pool.on("error", (err) => {
  console.error("PostgreSQL connection error:", err);
});

module.exports = pool;
