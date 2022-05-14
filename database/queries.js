import connection from "./connection";
import bcrypt from "bcrypt";
import beautifyError from "./beautifyError";

export const createUser = (email, username, password, responseToClient) => {
  const sql = `INSERT INTO users (email, username, password) VALUES (?, ?, ?)`;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const values = [email, username, hashedPassword];

  let response = { message: "success" };

  connection.query(sql, values, (error, result) => {
    if (error) {
      response.message = beautifyError(error);
      responseToClient.json(beautifyError(error));
      return;
    }
    responseToClient.json(response);
  });
};

export const loginUser = (username, password, responseToClient) => {
  const sql = `SELECT * from users WHERE username = ?`;
  const values = [username];
  let response = { message: "Wrong username or password" };

  connection.query(sql, values, (error, result) => {
    //if an error occurs, return the error to the client
    if (error) {
      responseToClient.json(beautifyError(error));
      return;
    }

    //if the user doesn't exist, return an error to the client
    if (result.length === 0) {
      responseToClient.json(response);
      return;
    }

    if (bcrypt.compareSync(password, result[0].password)) {
      response["data"] = {
        id: result[0].id,
        username: result[0].username,
        email: result[0].email,
      };
      response.message = "success";
      responseToClient.json(response);
      return;
    }

    responseToClient.json(response);
  });
};

export const getAllMovies = (responseToClient) => {
  const movies = [];

  const getProducers = async (movies, responseToClient) => {
    const sql = `SELECT producer from producers WHERE movie_id = ?`;
    await movies.forEach((movie, index) => {
      const values = [movie.id];
      connection.query(sql, values, async (error, result) => {
        if (error) {
          throw error;
        }
        movie.producers = result.map((res) => res.producer);
        if (index === movies.length - 1) {
          responseToClient.json(movies);
          return;
        }
      });
    });
    return movies;
  };

  const getActors = async (movies, responseToClient) => {
    const sql = `SELECT actor from actors WHERE movie_id = ?`;
    const counter = 0;
    await movies.forEach((movie, index) => {
      const values = [movie.id];
      connection.query(sql, values, async (error, result) => {
        if (error) {
          throw error;
        }
        movie.actors = result.map((res) => res.actor);
        if (index === movies.length - 1) {
          getProducers(movies, responseToClient);
        }
      });
    });
    return movies;
  };

  const getGenre = async (movies, responseToClient) => {
    const sql = `SELECT genre from genres WHERE movie_id = ?`;

    await movies.forEach((movie, index) => {
      const values = [movie.id];
      connection.query(sql, values, async (error, result) => {
        if (error) {
          throw error;
        }
        movie.genres = result.map((res) => res.genre);
        if (index === movies.length - 1) {
          getActors(movies, responseToClient);
        }
      });
    });
  };

  const data = new Promise((resolve, reject) => {
    const sql = `SELECT * from movies`;
    connection.query(sql, (error, result) => {
      if (error) {
        reject(beautifyError(error));
        return;
      }
      resolve(result);
    });
  });

  data.then((movies) => {
    getGenre(movies, responseToClient);
  });
};

export const getAllActors = (responseToClient) => {
  const sql = `SELECT * from actor_list`;
  connection.query(sql, (error, result) => {
    if (error) {
      responseToClient.json(beautifyError(error));
      return;
    }
    responseToClient.json(result);
  });
};
