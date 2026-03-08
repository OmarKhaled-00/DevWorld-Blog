import pg from "pg";

const { Pool } = pg;

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  port: process.env.PG_PORT,
});

db.on("connect", () => {
  console.log("PostgreSQL pool connected");
});

db.on("error", () => {
  console.log("PostgresSQL pool is not connected.");
});

export default db;
