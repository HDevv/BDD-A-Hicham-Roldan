import express from "express";
import {
  getAllServices,
  getServiceById,
  insertOneService,
  updateOneService,
  deleteServiceById,
  getManagerByService,
} from "../../data/database.js";

const servicesRouter = express.Router();

// Récupérer tous les services
// test ok
servicesRouter.get("/", async (req, res) => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching all services:", error);
    res.status(500).json({ message: "Unable to fetch services" });
  }
});

// Récupérer un service par ID
// TEST OK
servicesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const service = await getServiceById(id);
    if (service) {
      res.status(200).json(service);
    } else {
      res.status(404).json({ message: `Service with ID ${id} not found` });
    }
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    res.status(500).json({ message: "Error fetching service" });
  }
});

// Ajouter un nouveau service
// TEST OK
servicesRouter.post("/", async (req, res) => {
  const service = req.body;
  try {
    const newServiceId = await insertOneService(service);
    res.status(201).json({
      message: "Service added successfully",
      id: newServiceId,
    });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ message: "Failed to add service" });
  }
});

// Mettre à jour un service
// TEST OK
servicesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const service = { id, ...req.body };
  try {
    const isUpdated = await updateOneService(service);
    if (isUpdated) {
      res.status(200).json({ message: "Service updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update service" });
    }
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    res.status(500).json({ message: "Error updating service" });
  }
});

// Supprimer un service
// TEST OK
servicesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await deleteServiceById(id);
    if (isDeleted) {
      res.status(200).json({ message: "Service deleted successfully" });
    } else {
      res.status(404).json({ message: `Service with ID ${id} not found` });
    }
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    res.status(500).json({ message: "Error deleting service" });
  }
});

// Récupérer le manager d'un service
// TEST OK
servicesRouter.get("/:id/manager", async (req, res) => {
  const { id } = req.params;
  try {
    const manager = await getManagerByService(id);
    if (manager) {
      res.status(200).json(manager);
    } else {
      res
        .status(404)
        .json({ message: `No manager found for service ID ${id}` });
    }
  } catch (error) {
    console.error(`Error fetching manager for service ID ${id}:`, error);
    res.status(500).json({ message: "Error fetching manager" });
  }
});

export default servicesRouter;
