import connection from "./connection";
/**
    Users(id PK, username UNIQUE, password)
	Preferences(id FK, pref_genres, pref_movies, pref_actors)
	Movies(id PK, name, plot)
	Genres(movie_id FK, genre)
	Actors(movie_id FK, actor)
	Producers(movie_id FK, producer)
    */
export const createTables = () => {
  createUsers();
  createPreferences();
  createMovies();
  createGenres();
  createActors();
  createProducers();
};

const createUsers = () => {
  const sql = `CREATE TABLE IF NOT EXISTS users (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        email VARCHAR(255) UNIQUE NOT NULL,
                        username VARCHAR(255) UNIQUE, 
                        password VARCHAR(255) NOT NULL)`;

  connection.query(sql, (error, result) => {
    if (error) throw error;

    console.log(result);
  });
};

const createPreferences = () => {
  const sql = `CREATE TABLE IF NOT EXISTS preferences (
                        id INT NOT NULL, pref_genres VARCHAR(255), 
                        pref_movies VARCHAR(255), 
                        pref_actors VARCHAR(255), 
                        FOREIGN KEY (id) REFERENCES users(id))`;

  connection.query(sql, (error, result) => {
    if (error) throw error;

    console.log(result);
  });
};

const createMovies = () => {
  const sql = `CREATE TABLE IF NOT EXISTS movies (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        plot TEXT NOT NULL)`;
  connection.query(sql, (error, result) => {
    if (error) throw error;

    console.log(result);
  });
};

const createGenres = () => {
  const sql = `CREATE TABLE IF NOT EXISTS genres (
                        movie_id INT NOT NULL,
                        genre VARCHAR(255),
                        FOREIGN KEY (movie_id) REFERENCES movies(id))`;

  connection.query(sql, (error, result) => {
    if (error) throw error;

    console.log(result);
  });
};

const createActors = () => {
  const sql = `CREATE TABLE IF NOT EXISTS actors (
                        movie_id INT NOT NULL,
                        actor VARCHAR(255),
                        FOREIGN KEY (movie_id) REFERENCES movies(id))`;

  connection.query(sql, (error, result) => {
    if (error) throw error;

    console.log(result);
  });
};

const createProducers = () => {
  const sql = `CREATE TABLE IF NOT EXISTS producers (
                        movie_id INT NOT NULL,
                        producer VARCHAR(255),
                        FOREIGN KEY (movie_id) REFERENCES movies(id))`;

  connection.query(sql, (error, result) => {
    if (error) throw error;

    console.log(result);
  });
};
