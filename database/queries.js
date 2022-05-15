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

export const getMoviesByActor = (responseToClient, actor) => {
  console.log(actor);
  const movieByActor = `SELECT distinct
  m.name from actor_list al 
  JOIN actors a on al.name = a.actor 
  JOIN movies m on m.id = a.movie_id where al.name like '${actor}%' order by al.name;`;

  connection.query(movieByActor, (error, result) => {
    if (error) {
      console.log(error);
      responseToClient.json(beautifyError(error));
      return;
    }
    console.log(result);
    responseToClient.json(result);
  });
};

export const getMoviesByGenre = (responseToClient, genre) => {
  const sql = `SELECT * FROM movies m JOIN genres g on m.id = g.movie_id where genre = '${genre}'`;
  connection.query(sql, (error, result) => {
    if (error) {
      responseToClient.json(beautifyError(error));
      return;
    }
    responseToClient.json(result);
  });
};

export const addPreferateMovie = (userId, responseToClient) => {
  const sql =
    "INSERT INTO preferences (user_id, type, element_id) VALUES (?, ?, ?)";
  const values = [userId, "movie", movie];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log(error.code);
      responseToClient.json(beautifyError(error));
      return;
    }
    responseToClient.json({ message: "success" });
  });
};

export const addPreferateActor = (actor, userId, responseToClient) => {
  const sql =
    "INSERT INTO preferences (user_id, type, element_id) VALUES (?, ?, ?)";
  const values = [userId, "actor", movie];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log(error.code);
      responseToClient.json(beautifyError(error));
      return;
    }
    responseToClient.json({ message: "success" });
  });
};

export const getPreferateMovies = (userId, responseToClient) => {
  const sql = `SELECT * FROM preferences WHERE user_id = ? AND type = 'movie'`;
  const values = [userId];
  connection.query(sql, values, (error, result) => {
    if (error) {
      responseToClient.json(beautifyError(error));
      return;
    }
    responseToClient.json(result);
  });
};

export const getPreferateActors = (userId, responseToClient) => {
  const sql = `SELECT * FROM preferences WHERE user_id = ? AND type = 'actor'`;
  const values = [userId];
  connection.query(sql, values, (error, result) => {
    if (error) {
      responseToClient.json(beautifyError(error));
      return;
    }
    responseToClient.json(result);
  });
};
