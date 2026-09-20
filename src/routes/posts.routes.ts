import { Router } from "express";
import {
  createPost,
  deletePost,
  getPost,
  updatePost,
} from "../controllers/posts.controller";

const postsRouter = Router();

postsRouter.post("/posts", createPost);
postsRouter.get("/posts/:id", getPost);
postsRouter.put("/posts/:id", updatePost);
postsRouter.delete("/posts/:id", deletePost);

export { postsRouter };
