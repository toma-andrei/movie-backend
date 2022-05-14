import csvParser from "csv-parser";
import fs from "fs";
import { release } from "os";
import connection from "./connection";

export const populateTables = () => {
  const resultsMovie = [];
  const resultsCredits = [];
  const filtered = [];
  const getMovies = new Promise((resolve, reject) => {
    fs.createReadStream("./database/tmdb_5000_movies.txt")
      .pipe(csvParser())
      .on("data", (row) => {
        resultsMovie.push(row);
      })
      .on("end", () => {
        resultsMovie.forEach((movie) => {
          let genreObjectList = JSON.parse(movie.genres);

          const genres = genreObjectList.map((genre) => {
            return genre.name;
          });

          const producers = JSON.parse(movie.production_companies).map(
            (producer) => {
              return producer.name;
            }
          );

          filtered.push({
            title: movie.title,
            plot: movie.overview,
            producers: producers.join(", "),
            genres: genres,
            release_date: movie.release_date,
          });
          resolve(filtered);
        });
      });
  });

  const getCast = new Promise((resolve, reject) => {
    const actors = [];
    const directors = [];

    fs.createReadStream("./database/tmdb_5000_credits.txt")
      .pipe(csvParser())
      .on("data", (row) => {
        resultsCredits.push(row);
      })
      .on("end", () => {
        resultsCredits.forEach((credit) => {
          const cast = JSON.parse(credit.cast);
          const director = JSON.parse(credit.crew).find(
            (crew) => crew.job === "Director"
          );
          if (director.name) directors.push(director.name);
          actors.push(cast.map((actor) => actor.name));
        });
        resolve({ actors, directors });
      });
  });

  getMovies.then((movies) => {
    getCast
      .then(({ actors, directors }) => {
        const finalList = [];
        movies.forEach((movie, index) => {
          if (actors[index])
            finalList.push({
              ...movie,
              actors: actors[index].slice(0, 7),
              director: directors[index],
            });
        });
        return finalList;
      })
      .then((finalList) => {
        insertIntoTables(finalList);
      });
  });
};

const insertIntoTables = (finalList) => {
  if (finalList.length === 0) {
    return;
  }
  console.log(finalList);
  finalList.forEach((movie) => {
    // console.log(movie);
    const { title, plot, producers, genres, actors, release_date, director } =
      movie;
    const sql =
      "INSERT INTO movies (name, plot, release_date, director) VALUES (?, ?, ?, ?)";
    const values = [title, plot, release_date, director];
    connection.query(sql, values, (err, results) => {
      if (err) throw err;

      const movieId = results.insertId;

      const sql = "INSERT INTO genres (movie_id, genre) VALUES (?, ?)";
      if (genres && genres.length > 0)
        genres.forEach((genre) => {
          const values = [movieId, genre];
          connection.query(sql, values, (err, results) => {
            if (err) throw err;
          });
        });
      if (actors && actors.length > 0)
        actors.forEach((actor) => {
          const sql = "INSERT INTO actors (movie_id, actor) VALUES (?, ?)";
          const values = [movieId, actor];
          connection.query(sql, values, (err, results) => {
            if (err) throw err;
          });
        });
      let prod = producers.split(",");
      if (prod && prod.length > 0)
        prod.forEach((producer) => {
          const sql =
            "INSERT INTO producers (movie_id, producer) VALUES (?, ?)";
          const values = [movieId, producer];
          connection.query(sql, values, (err, results) => {
            if (err) throw err;
          });
        });
    });
  });

  const sql = [
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Johnny Depp', '1963-09-06', 'John Christopher Depp II is an American actor, producer, musician and painter.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Leonardo DiCaprio', '1974-11-11', 'Leonardo Wilhelm DiCaprio is an American actor, producer, and environmentalist. He has been nominated for ten Golden Globe Awards and has won three Academy Awards and one BAFTA Award.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Daniel Craig', '1968-03-02', 'Daniel Craig is an English actor. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Brad Pitt', '1963-12-18', 'Brad Pitt is an American actor and producer. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Tom Hardy', '1977-09-15', 'Tom Hardy is an English actor. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Robert Downey Jr', '1965-04-04', 'Robert Downey Jr. is an American actor, producer, and singer. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Chris Evans', '1981-06-13', 'Christopher Robert Evans is an American actor, producer, and environmentalist. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Chris Hemsworth', '1983-08-11', 'Christopher Robert Hemsworth is an Australian actor, producer, and environmentalist. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Scarlett Johansson', '1984-11-22', 'Scarlett Johansson is an American actress, producer, and environmentalist. She has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Jeremy Renner', '1971-01-07', 'Jeremy Renner is an American actor, producer, and environmentalist. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Mark Strong', '1963-08-05', 'Mark Strong is an English actor. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Ian McKellen', '1939-05-25', 'Ian Charles McKellen is an English actor. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Helena Bonham Carter', '1966-05-26', 'Helena Bonham Carter is an English actress. She has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('James Franco', '1978-04-19', 'James Franco is an English actor. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
    "INSERT INTO actor_list (name, birth_date, description) VALUES ('Christian Bale', '1974-01-30', 'Christian Charles Philip Bale is an English actor, producer, and environmentalist. He has been nominated for three Academy Awards and won two Golden Globe Awards.')",
  ];

  sql.forEach((query) => {
    connection.query(query, (err, results) => {
      if (err) throw err;
    });
  });
};
