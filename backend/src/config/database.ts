import mysql, { Pool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool: Pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "mahadi",
  password: process.env.DB_PASSWORD || "has12144331",
  database: process.env.DB_NAME || "thesporadicthinker",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;


