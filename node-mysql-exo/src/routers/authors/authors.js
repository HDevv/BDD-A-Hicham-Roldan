//@ts-nocheck
import express from "express";
import {
  getAllAuthors,
  getAuthorById,
  insertOneAuthor,
  updateOneAuthor,
  insertManyAuthors,
  updateManyAuthors,
} from "../../data/database.js";

const authorsRouter = express.Router();

// Obtenir tous les auteurs
authorsRouter.get("/", async (req, res) => {
  try {
    const authors = await getAllAuthors();
    res.status(200).json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ message: "Failed to fetch authors" });
  }
});

// Obtenir auteur par ID
authorsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const author = await getAuthorById(id);
    if (author.length === 0) {
      return res
        .status(404)
        .json({ message: `Author with ID ${id} not found` });
    }
    res.status(200).json(author);
  } catch (error) {
    console.error("Error fetching author:", error);
    res.status(500).json({ message: "Failed to fetch author" });
  }
});

// Ajouter nouvel auteur
authorsRouter.post("/", async (req, res) => {
  try {
    const authorDetails = req.body;
    const { first_name, last_name, email } = authorDetails;

    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        message: "Missing required fields: first_name, last_name, email",
      });
    }

    const newAuthorId = await insertOneAuthor(authorDetails);
    res
      .status(201)
      .json({ message: "Author added successfully", id: newAuthorId });
  } catch (error) {
    console.error("Error adding author:", error);
    res.status(500).json({ message: "Failed to add author" });
  }
});

// Ajouter plusieurs auteurs
authorsRouter.post("/many", async (req, res) => {
  try {
    const authorsDetails = req.body;
    const insertedIds = await insertManyAuthors(authorsDetails);
    res
      .status(201)
      .json({ message: "Authors added successfully", ids: insertedIds });
  } catch (error) {
    console.error("Error adding multiple authors:", error);
    res.status(500).json({ message: "Failed to add authors" });
  }
});

// Màj un auteur
authorsRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authorDetails = { id, ...req.body };
    const isUpdated = await updateOneAuthor(authorDetails);

    if (isUpdated) {
      res.status(200).json({ message: "Author updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update author" });
    }
  } catch (error) {
    console.error("Error updating author:", error);
    res.status(500).json({ message: "Failed to update author" });
  }
});

// Màj plusieurs auteurs
authorsRouter.put("/many", async (req, res) => {
  try {
    const authorsDetails = req.body;
    const updateResults = await updateManyAuthors(authorsDetails);
    res.status(200).json({
      message: "Authors updated successfully",
      results: updateResults,
    });
  } catch (error) {
    console.error("Error updating multiple authors:", error);
    res.status(500).json({ message: "Failed to update authors" });
  }
});

export default authorsRouter;
