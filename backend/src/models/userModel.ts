import pool from "../config/database";
import bcrypt from "bcryptjs";

export interface UserRecord {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface NewUserInput {
  username: string;
  email: string;
  passwordHash: string;
  role: string;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  const typedRows = rows as UserRecord[];
  return typedRows[0] || null;
}

export async function createUser(input: NewUserInput) {
  const { username, email, passwordHash, role } = input;
  const [result] = await pool.execute(
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
    [username, email, passwordHash, role]
  );
  const info = result as { insertId: number };
  return { id: info.insertId, username, email, role };
}

export async function verifyPassword(
  plain: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}


