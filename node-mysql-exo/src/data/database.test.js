import {
  getAllAuthors,
  closeConnection,
  getAuthorById,
  connexion,
  initDbConnection,
} from "./database.js";

let newDidierId;

beforeAll(async () => {
  await initDbConnection();

  // Supprime utilisateur
  await connexion.query(
    "DELETE FROM authors WHERE email='didier.super@yahoo.com'"
  );

  // Ajoute utilisateur
  const [resultset, _] = await connexion.query(
    "INSERT INTO authors (first_name, last_name, email, birthdate) VALUES (?,?,?,?)",
    ["didier", "super", "didier.super@yahoo.com", "1960-01-01"]
  );
  newDidierId = resultset.insertId;
});

afterAll(async () => {
  await closeConnection();
});

test("when getAllAuthors() is called, the response should be a [list] of Authors", async () => {
  const authorsList = await getAllAuthors();
  expect(authorsList.length).not.toEqual(0);
});

test("should return didier details when getAuthorById called with right ID", async () => {
  const didierDetails = {
    first_name: "didier",
    last_name: "super",
    email: "didier.super@yahoo.com",
  };
  const didierResult = await getAuthorById(newDidierId);
  expect(didierResult.length).toEqual(1);
  expect(didierResult[0]).not.toEqual({});
  expect(didierResult[0]).toEqual(expect.objectContaining(didierDetails));
});
