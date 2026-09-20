import { Request, Response } from "express";
import { pool } from "../config/database";

export const getData = async (_req: Request, res: Response) => {
  const result = await pool.query(`
    SELECT
      posts.id,
      posts.title,
      posts.content,
      posts.user_id,
      users.username,
      posts.created_at
    FROM posts
    JOIN users ON users.id = posts.user_id
    ORDER BY posts.id
  `);

  return res.json({
    posts: result.rows,
  });
};
