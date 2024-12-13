import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

// Connexion BDD
let connection;

export const initDbConnection = async () => {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  console.log("Connected to Database");
};

// tests
export const connexion = {
  query: async (sql, params) => {
    if (!connection) {
      throw new Error(
        "Database connection not initialized. Call initDbConnection() first."
      );
    }
    return connection.execute(sql, params);
  },
};

/**********************************
 * EMPLOYEES
 */

// Récupérer tous les employés
// TEST OK
export const getAllEmployees = async () => {
  const [rows] = await connection.execute("SELECT * FROM employees");
  return rows;
};

// Récupérer un employé par ID
// TEST OK
export const getEmployeeById = async (id) => {
  const [rows] = await connection.execute(
    "SELECT * FROM employees WHERE id = ?",
    [id]
  );
  return rows[0];
};

// Insérer un nouvel employé
// TEST OK
export const insertOneEmployee = async (employee) => {
  const { first_name, last_name, email, salary, service_id } = employee;
  const [result] = await connection.execute(
    "INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)",
    [first_name, last_name, email, salary, service_id]
  );
  return result.insertId;
};

// Mettre à jour un employé
// TEST OK
export const updateOneEmployee = async (employee) => {
  const { id, first_name, last_name, email, salary, service_id } = employee;
  const [result] = await connection.execute(
    "UPDATE employees SET first_name = ?, last_name = ?, email = ?, salary = ?, service_id = ? WHERE id = ?",
    [first_name, last_name, email, salary, service_id, id]
  );
  return result.affectedRows > 0;
};

// Supprimer un employé
// TEST OK
export const deleteEmployeeById = async (id) => {
  const [result] = await connection.execute(
    "DELETE FROM employees WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

/**********************************
 * SERVICES
 */

// Récupérer tous les services
// TEST OK
export const getAllServices = async () => {
  const [rows] = await connection.execute("SELECT * FROM services");
  return rows;
};

// Test OK
export const getServiceById = async (id) => {
  try {
    const [rows] = await connection.execute(
      "SELECT * FROM services WHERE id = ?",
      [id]
    );
    return rows[0]; // Retourne le premier élément ou undefined si non trouvé
  } catch (error) {
    console.error("Error in getServiceById:", error);
    throw error; // Propager l'erreur pour qu'elle soit gérée plus haut
  }
};

// TEST OK
// Ajouter un service
export const insertOneService = async (service) => {
  const { name, office_number } = service;
  const [result] = await connection.execute(
    "INSERT INTO services (name, office_number) VALUES (?, ?)",
    [name, office_number]
  );
  return result.insertId;
};

// TEST OK
// Mettre à jour un service
export const updateOneService = async (service) => {
  const { id, name, office_number } = service;
  const [result] = await connection.execute(
    "UPDATE services SET name = ?, office_number = ? WHERE id = ?",
    [name, office_number, id]
  );
  return result.affectedRows > 0;
};

// TEST OK
// Supprimer un service par ID
export const deleteServiceById = async (id) => {
  const [result] = await connection.execute(
    "DELETE FROM services WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

// Récupérer le manager d'un service
// TEST OK
export const getManagerByService = async (serviceId) => {
  const [rows] = await connection.execute(
    `
    SELECT 
      e.first_name AS manager_first_name, 
      e.last_name AS manager_last_name, 
      s.name AS service_name, 
      m.start_date AS manager_start_date
    FROM manage m
    JOIN employees e ON m.employee_id = e.id
    JOIN services s ON m.service_id = s.id
    WHERE m.service_id = ?
  `,
    [serviceId]
  );
  return rows[0];
};
