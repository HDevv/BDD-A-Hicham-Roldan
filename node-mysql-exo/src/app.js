//@ts-nocheck
import express from "express";
import dotenv from "dotenv";
import authorsRouter from "./routers/authors/authors.js";
import postsRouter from "./routers/posts/posts.js";
import { initDbConnection } from "./data/database.js";
dotenv.config({ path: "./config/.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
  try {
    await initDbConnection();
    console.log("Database connection initialized");

    // Routes API
    app.use("/api/authors", authorsRouter);
    app.use("/api/posts", postsRouter);

    // Route test
    app.get("/", (req, res) => {
      res.send("Welcome to the API!");
    });

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
