import express from "express";
import {
  getAllPosts,
  getPostById,
  insertOnePost,
  updateOnePost,
} from "../../data/database.js";

const postsRouter = express.Router();

// Tous les posts
postsRouter.get("/", async (req, res) => {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    res.status(500).json({ message: "Unable to fetch posts" });
  }
});

// Un post par ID
postsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPostById(id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: `Post with ID ${id} not found` });
    }
  } catch (error) {
    console.error(`Error fetching post with ID ${id}:`, error);
    res.status(500).json({ message: "Error fetching post" });
  }
});

// Insérer nouveau post
postsRouter.post("/", async (req, res) => {
  const postDetails = req.body;
  try {
    const newPostId = await insertOnePost(postDetails);
    res.status(201).json({ message: "Post added successfully", id: newPostId });
  } catch (error) {
    console.error("Error inserting post:", error);
    res.status(500).json({ message: "Failed to add post" });
  }
});

// Màj un post
postsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const postDetails = { id, ...req.body };
  try {
    const isUpdated = await updateOnePost(postDetails);
    if (isUpdated) {
      res.status(200).json({ message: "Post updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update post" });
    }
  } catch (error) {
    console.error(`Error updating post with ID ${id}:`, error);
    res.status(500).json({ message: "Error updating post" });
  }
});

export default postsRouter;
