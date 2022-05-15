import connection from "./connection";
/**
 */
export const createTables = () => {
  createUsers();
  createPreferences();
  createMovies();
  createGenres();
  createActors();
  createActorsList();
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
                        id INT AUTO_INCREMENT PRIMARY KEY, 
                        user_id INT NOT NULL,
                        type VARCHAR(255) NOT NULL,
                        element_id INT NOT NULL,
                        UNIQUE (user_id, type, element_id),
                        FOREIGN KEY (user_id) REFERENCES users(id))`;

  connection.query(sql, (error, result) => {
    if (error) throw error;

    console.log(result);
  });
};

const createMovies = () => {
  const sql = `CREATE TABLE IF NOT EXISTS movies (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        plot TEXT NOT NULL,
                        release_date VARCHAR(255) NOT NULL,
                        director VARCHAR(255))`;
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

const createActorsList = () => {
  const sql = `CREATE TABLE IF NOT EXISTS actor_list (
                     actor_id INT AUTO_INCREMENT PRIMARY KEY, 
                        name VARCHAR(255) NOT NULL, 
                        birth_date VARCHAR(255) NOT NULL,
                        description TEXT NOT NULL)`;
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
