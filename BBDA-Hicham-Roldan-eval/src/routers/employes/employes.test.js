// @ts-nocheck
import { cleanEmployees, seedEmployees } from "../../data/database.test.js";
import { initDbConnection, connexion } from "../../data/database.js";

let newEmployeeId;

beforeAll(async () => {
  await initDbConnection();
  await cleanEmployees();
  newEmployeeId = await seedEmployees();
});

afterAll(async () => {
  console.log("All tests for employees completed");
});

test("should fetch all employees", async () => {
  const [employees] = await connexion.query("SELECT * FROM employees");
  expect(employees.length).toBeGreaterThan(0);
});

test("should fetch an employee by ID", async () => {
  const [rows] = await connexion.query("SELECT * FROM employees WHERE id = ?", [
    newEmployeeId,
  ]);
  const employee = rows[0];
  expect(employee).toHaveProperty("email", "cass.oulet@example.com");
});

test("should insert a new employee", async () => {
  const newEmployee = {
    first_name: "Alice",
    last_name: "Elleglisse",
    email: "alice.glisse@example.com",
    salary: 55000,
    service_id: 1,
  };

  const [result] = await connexion.query(
    "INSERT INTO employees (first_name, last_name, email, salary, service_id) VALUES (?, ?, ?, ?, ?)",
    [
      newEmployee.first_name,
      newEmployee.last_name,
      newEmployee.email,
      newEmployee.salary,
      newEmployee.service_id,
    ]
  );

  expect(result.insertId).toBeDefined();
});
