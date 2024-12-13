//@ts-nocheck
import express from "express";
import dotenv from "dotenv";
import employeesRouter from "./routers/employes/employes.js";
import servicesRouter from "./routers/services/services.js";
import { initDbConnection } from "./data/database.js";

dotenv.config({ path: "./config/.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialisation BDD
const startServer = async () => {
  try {
    await initDbConnection();
    console.log("Database connection initialized");

    // Routes API
    app.use("/api/employees", employeesRouter);
    app.use("/api/services", servicesRouter);

    // Route de test
    app.get("/", (req, res) => {
      res.send("Bienvenue dans l'API!");
    });

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
