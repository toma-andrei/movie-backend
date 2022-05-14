import express from "express";
import { createTables } from "./database/tables";
import {
  createUser,
  getAllMovies,
  loginUser,
  getAllActors,
} from "./database/queries";
import { populateTables } from "./database/populateTables";

const app = express();
app.use(express.json());

//allow origin
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

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

app.get("/actors", (req, res) => {
  getAllActors(res);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  // createTables();
  // populateTables();
});
