import csvParser from "csv-parser";
import fs from "fs";
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
          });
          resolve(filtered);
        });
      });
  });

  const getCast = new Promise((resolve, reject) => {
    const actors = [];
    fs.createReadStream("./database/tmdb_5000_credits.txt")
      .pipe(csvParser())
      .on("data", (row) => {
        resultsCredits.push(row);
      })
      .on("end", () => {
        resultsCredits.forEach((credit) => {
          const cast = JSON.parse(credit.cast);

          actors.push(cast.map((actor) => actor.name));
        });
        resolve(actors);
      });
  });

  getMovies.then((movies) => {
    getCast
      .then((actors) => {
        const finalList = [];
        movies.forEach((movie, index) => {
          if (actors[index])
            finalList.push({ ...movie, actors: actors[index].slice(0, 7) });
        });
        return finalList;
      })
      .then((finalList) => {
        insertIntoTables(finalList);
      });
  });
};

const insertIntoTables = (finalList) => {
  finalList.forEach((movie) => {
    const { title, plot, producers, genres, actors } = movie;
    console.log(movie);
    const sql = "INSERT INTO movies (name, plot) VALUES (?, ?)";
    const values = [title, plot];
    connection.query(sql, values, (err, results) => {
      if (err) throw err;

      const movieId = results.insertId;

      const sql = "INSERT INTO genres (movie_id, genre) VALUES (?, ?)";
      genres.forEach((genre) => {
        const values = [movieId, genre];
        connection.query(sql, values, (err, results) => {
          if (err) throw err;
        });
      });

      actors.forEach((actor) => {
        const sql = "INSERT INTO actors (movie_id, actor) VALUES (?, ?)";
        const values = [movieId, actor];
        connection.query(sql, values, (err, results) => {
          if (err) throw err;
        });
      });

      producers.split(",").forEach((producer) => {
        const sql = "INSERT INTO producers (movie_id, producer) VALUES (?, ?)";
        const values = [movieId, producer];
        connection.query(sql, values, (err, results) => {
          if (err) throw err;
        });
      });
    });
  });
};
