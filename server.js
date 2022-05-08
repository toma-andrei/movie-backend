import express from "express";
import { createTables } from "./database/tables";
import { createUser, getAllMovies, loginUser } from "./database/queries";
import { populateTables } from "./database/populateTables";

const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  const { email, username, password } = req.body;
  createUser(email, username, password, res);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  loginUser(username, password, res);
});

app.get("/movies", (req, res) => {
  getAllMovies(res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  //   createTables();
  //   populateTables();
});
