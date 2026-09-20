import { Request, Response } from "express";
import { pool } from "../config/database";

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE username = $1",
    [username],
  );

  if (existingUser.rows.length > 0) {
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  const result = await pool.query(
    `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username
    `,
    [username, password],
  );

  return res.status(201).json({
    user: result.rows[0],
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const result = await pool.query(
    "SELECT id, username, password_hash FROM users WHERE username = $1",
    [username],
  );

  if (result.rows.length === 0) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const user = result.rows[0];

  // Временно. На этапе защиты заменим на bcrypt.compare().
  if (password !== user.password_hash) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  return res.json({
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
    },
  });
};
