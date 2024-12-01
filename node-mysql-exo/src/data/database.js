import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

let connexion;

export const initDbConnection = async () => {
  if (!connexion) {
    try {
      connexion = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      console.log("Database connection established successfully");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      process.exit(1);
    }
  }
};

export const closeConnection = async () => {
  if (connexion) {
    try {
      await connexion.end();
      console.log("Database connection closed successfully");
    } catch (error) {
      console.error("Error closing the database connection:", error);
    }
  }
};

export const getAllAuthors = async () => {
  try {
    const [results] = await connexion.query("SELECT * FROM authors");
    return results;
  } catch (error) {
    console.error("Error fetching all authors:", error);
    throw error;
  }
};

export const getAuthorById = async (authorId) => {
  try {
    const [results] = await connexion.query(
      "SELECT * FROM authors WHERE id = ?",
      [authorId]
    );
    return results;
  } catch (error) {
    console.error(`Error fetching author with ID ${authorId}:`, error);
    throw error;
  }
};

// Nouvel auteur
export const insertOneAuthor = async (authorDetails) => {
  const { first_name, last_name, email, birthdate } = authorDetails;
  if (!first_name || !last_name || !email) {
    throw new Error("Invalid author details");
  }
  try {
    const [results] = await connexion.query(
      "INSERT INTO authors (first_name, last_name, email, birthdate) VALUES (?, ?, ?, ?)",
      [first_name, last_name, email, birthdate]
    );
    return results.insertId;
  } catch (error) {
    console.error("Error inserting author:", error);
    throw error;
  }
};

// Màj un auteur
export const updateOneAuthor = async (authorDetails) => {
  const { id, first_name, last_name, email, birthdate } = authorDetails;
  if (!id || !first_name || !last_name || !email) {
    throw new Error("Invalid author details for update");
  }
  try {
    const [results] = await connexion.query(
      "UPDATE authors SET first_name = ?, last_name = ?, email = ?, birthdate = ? WHERE id = ?",
      [first_name, last_name, email, birthdate, id]
    );
    return results.affectedRows === 1;
  } catch (error) {
    console.error("Error updating author:", error);
    throw error;
  }
};

// Récupérer tous les posts
export const getAllPosts = async () => {
  try {
    const [results] = await connexion.query("SELECT * FROM posts");
    return results;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};

// Récupérer un post par ID
export const getPostById = async (postId) => {
  try {
    const [results] = await connexion.query(
      "SELECT * FROM posts WHERE id = ?",
      [postId]
    );
    return results;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

// Insérer nouveau post
export const insertOnePost = async (postDetails) => {
  const { title, content, author_id } = postDetails;
  if (!title || !content || !author_id) {
    throw new Error("Invalid post details");
  }
  try {
    const [results] = await connexion.query(
      "INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)",
      [title, content, author_id]
    );
    return results.insertId;
  } catch (error) {
    console.error("Error inserting post:", error);
    throw error;
  }
};

// Màj un post
export const updateOnePost = async (postDetails) => {
  const { id, title, content, author_id } = postDetails;
  if (!id || !title || !content || !author_id) {
    throw new Error("Invalid post details for update");
  }
  try {
    const [results] = await connexion.query(
      "UPDATE posts SET title = ?, content = ?, author_id = ? WHERE id = ?",
      [title, content, author_id, id]
    );
    return results.affectedRows === 1;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export { connexion };
