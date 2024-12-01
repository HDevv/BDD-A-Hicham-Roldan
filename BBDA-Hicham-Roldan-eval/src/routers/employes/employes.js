import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  insertOneEmployee,
  updateOneEmployee,
  deleteEmployeeById,
} from "../../data/database.js";

const employeesRouter = express.Router();

// Récupérer tous les employés
employeesRouter.get("/", async (req, res) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching all employees:", error);
    res.status(500).json({ message: "Unable to fetch employees" });
  }
});

// Récupérer un employé par ID
employeesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await getEmployeeById(id);
    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: `Employee with ID ${id} not found` });
    }
  } catch (error) {
    console.error(`Error fetching employee with ID ${id}:`, error);
    res.status(500).json({ message: "Error fetching employee" });
  }
});

// Ajouter un nouvel employé
employeesRouter.post("/", async (req, res) => {
  const employee = req.body;
  try {
    const newEmployeeId = await insertOneEmployee(employee);
    res
      .status(201)
      .json({ message: "Employee added successfully", id: newEmployeeId });
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Failed to add employee" });
  }
});

// Mettre à jour un employé
employeesRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const employee = { id, ...req.body };
  try {
    const isUpdated = await updateOneEmployee(employee);
    if (isUpdated) {
      res.status(200).json({ message: "Employee updated successfully" });
    } else {
      res.status(400).json({ message: "Failed to update employee" });
    }
  } catch (error) {
    console.error(`Error updating employee with ID ${id}:`, error);
    res.status(500).json({ message: "Error updating employee" });
  }
});

// Supprimer un employé
employeesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await deleteEmployeeById(id);
    if (isDeleted) {
      res.status(200).json({ message: "Employee deleted successfully" });
    } else {
      res.status(404).json({ message: `Employee with ID ${id} not found` });
    }
  } catch (error) {
    console.error(`Error deleting employee with ID ${id}:`, error);
    res.status(500).json({ message: "Error deleting employee" });
  }
});

export default employeesRouter;
