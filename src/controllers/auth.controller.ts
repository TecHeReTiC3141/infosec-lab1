import { Request, Response } from "express";
import { pool } from "../config/database";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Username and password must be strings",
    });
  }

  if (username.length < 3 || username.length > 100) {
    return res.status(400).json({
      message: "Username must contain between 3 and 100 characters",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must contain at least 8 characters",
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

  const passwordHash = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
      INSERT INTO users (username, password_hash)
      VALUES ($1, $2)
      RETURNING id, username
    `,
    [username, passwordHash],
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

  if (typeof username !== "string" || typeof password !== "string") {
    return res.status(400).json({
      message: "Username and password must be strings",
    });
  }

  const result = await pool.query(
    `
      SELECT id, username, password_hash
      FROM users
      WHERE username = $1
    `,
    [username],
  );

  if (result.rows.length === 0) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const user = result.rows[0];

  const passwordValid = await bcrypt.compare(password, user.password_hash);

  if (!passwordValid) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return res.json({
    message: "Login successful",
    token,
    tokenType: "Bearer",
    user: {
      id: user.id,
      username: user.username,
    },
  });
};
