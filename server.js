import express from "express";
import { createTables } from "./database/tables";
import {
  createUser,
  getAllMovies,
  loginUser,
  getAllActors,
  getMoviesByActor,
  getMoviesByGenre,
  addPreferateActor,
  addPreferateMovie,
  getPreferateMovies,
  getPreferateActors,
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

app.post("/preferences", (req, res) => {
  const { type, userId, id } = req.body;

  if (type === "movie") {
    addPreferateMovie(id, userId, res);
  } else {
    addPreferateActor(id, userId, res);
  }
});

app.get("/movies", (req, res) => {
  getAllMovies(res);
});

app.get("/actors", (req, res) => {
  getAllActors(res);
});
app.get("/movie/preferences/:userId", (req, res) => {
  const { userId } = req.params;
  getPreferateMovies(userId, res);
});
app.get("/actor/preferences/:userId", (req, res) => {
  const { userId } = req.params;
  getPreferateActors(userId, res);
});

app.get("/movie/:actor", (req, res) => {
  const { actor } = req.params;
  getMoviesByActor(res, actor);
});

app.get("/:genre", (req, res) => {
  const { genre } = req.params;
  getMoviesByGenre(res, genre);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  // createTables();
  // populateTables();
});
