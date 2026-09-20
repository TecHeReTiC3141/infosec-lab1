import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../controllers/posts.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const postsRouter = Router();

postsRouter.post("/posts", authenticateToken, createPost);
postsRouter.get("/posts/:id", authenticateToken, getPost);
postsRouter.put("/posts/:id", authenticateToken, updatePost);
postsRouter.delete("/posts/:id", authenticateToken, deletePost);

export { postsRouter };
