// @ts-nocheck
import { cleanServices, seedServices } from "../../data/database.test.js";
import { initDbConnection, connexion } from "../../data/database.js";

let newServiceId;

beforeAll(async () => {
  await initDbConnection();
  await cleanServices();
  newServiceId = await seedServices();
});

afterAll(async () => {
  console.log("All tests for services completed");
});

test("should fetch all services", async () => {
  const [services] = await connexion.query("SELECT * FROM services");
  expect(services.length).toBeGreaterThan(0);
});

test("should fetch a service by ID", async () => {
  const [rows] = await connexion.query("SELECT * FROM services WHERE id = ?", [
    newServiceId,
  ]);
  const service = rows[0];
  expect(service).toHaveProperty("name", "Support Gastronomique");
});

test("should insert a new service", async () => {
  const newService = {
    name: "Rôtisserie",
    office_number: "RT100",
  };

  const [result] = await connexion.query(
    "INSERT INTO services (name, office_number) VALUES (?, ?)",
    [newService.name, newService.office_number]
  );

  expect(result.insertId).toBeDefined();
});
