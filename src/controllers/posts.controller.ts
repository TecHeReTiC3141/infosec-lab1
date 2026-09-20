import { Request, Response } from "express";
import { pool } from "../config/database";
import { sanitizeText } from "../utils";

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  if (typeof title !== "string" || typeof content !== "string") {
    return res.status(400).json({
      message: "Title and content must be strings",
    });
  }

  const sanitizedTitle = sanitizeText(title);
  const sanitizedContent = sanitizeText(content);

  const userId = req.user!.userId;

  const result = await pool.query(
    `
      INSERT INTO posts (title, content, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, content, user_id, created_at
    `,
    [sanitizedTitle, sanitizedContent, userId],
  );

  return res.status(201).json({
    post: result.rows[0],
  });
};

export const getPost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `
      SELECT
        posts.id,
        posts.title,
        posts.content,
        posts.user_id,
        users.username,
        posts.created_at
      FROM posts
      JOIN users ON users.id = posts.user_id
      WHERE posts.id = $1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.json({
    post: result.rows[0],
  });
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required",
    });
  }

  if (typeof title !== "string" || typeof content !== "string") {
    return res.status(400).json({
      message: "Title and content must be strings",
    });
  }

  const sanitizedTitle = sanitizeText(title);
  const sanitizedContent = sanitizeText(content);

  const result = await pool.query(
    `
      UPDATE posts
      SET title = $1,
          content = $2
      WHERE id = $3
        AND user_id = $4
      RETURNING id, title, content, user_id, created_at
    `,
    [sanitizedTitle, sanitizedContent, id, req.user!.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.json({
    post: result.rows[0],
  });
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `
      DELETE FROM posts
      WHERE id = $1
        AND user_id = $2
      RETURNING id
    `,
    [id, req.user!.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({
      message: "Post not found",
    });
  }

  return res.status(204).send();
};
