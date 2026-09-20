import express from "express";
import "dotenv/config";

import { authRouter } from "./routes/auth.routes";
import { dataRouter } from "./routes/data.routes";
import { postsRouter } from "./routes/posts.routes";

const app = express();

app.use(express.json());

app.use("/auth", authRouter);
app.use("/api", dataRouter);
app.use("/api", postsRouter);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
