// @ts-nocheck
import { initDbConnection, connexion } from "./database.js";

// Nettoyer les tables
export const cleanEmployees = async () => {
  await connexion.query("DELETE FROM employees");
  console.log("Employees table cleaned");
};

export const cleanServices = async () => {
  await connexion.query("DELETE FROM services");
  console.log("Services table cleaned");
};

// Seed des données
export const seedEmployees = async () => {
  await connexion.query(
    "INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)",
    ["Cass", "Oulet", "cass.oulet@example.com", 50000, 1]
  );

  const [resultset] = await connexion.query(
    "SELECT id FROM employees WHERE email='cass.oulet@example.com'"
  );
  console.log("Employees table seeded");
  return resultset[0]?.id;
};

export const seedServices = async () => {
  await connexion.query(
    "INSERT INTO services (name, office_number) VALUES (?, ?)",
    ["Support Gastronomique", "SG001"]
  );

  const [resultset] = await connexion.query(
    "SELECT id FROM services WHERE name='Support Gastronomique'"
  );
  console.log("Services table seeded");
  return resultset[0]?.id;
};

// Test simple pour vérifier la connexion
beforeAll(async () => {
  await initDbConnection();
});

test("should connect to the database and execute a query", async () => {
  const [rows] = await connexion.query("SELECT 1");
  expect(rows).toBeDefined();
});
