import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  port: 3306,
  password: "",
  database: "moviesdb",
};

const connection = await mysql.createConnection(config);

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase();
      const [movies] = await connection.query(
        `SELECT m.title, m.year, m.director, m.duration, m.poster, GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') as Genres, m.rate, BIN_TO_UUID(m.id) AS ID 
      FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON g.id = mg.genre_id 
      WHERE m.id IN (SELECT mg2.movie_id FROM movie_genres mg2 JOIN genre g2 ON g2.id = mg2.genre_id WHERE LOWER(g2.name) = ?) GROUP BY m.id;`,
        [lowerCaseGenre]
      );
      return movies;
    }
    const [movies] = await connection.query(
      `SELECT m.title, m.year, m.director, m.duration, m.poster, GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') as Genres, m.rate, BIN_TO_UUID(m.id) AS ID 
      FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON g.id = mg.genre_id GROUP BY m.id;`
    );
    return movies;
  };

  //Se utiliza {id} porque es más fácil de actualizar si la función se modifica
  static async getById({ id }) {
    //async await con función normal
    const movie = await connection.query(
      `SELECT m.title, m.year, m.director, m.duration, m.poster, GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') as Genres, m.rate, BIN_TO_UUID(m.id) AS ID 
      FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON g.id = mg.genre_id WHERE BIN_TO_UUID(m.id) = ? GROUP BY m.id;`,
      [id]
    );

    if (movie.length === 0) {
      return null;
    }
    return movie[0]; //Se devuelve el primer elemento del array porque sino envía un buffer de datos
  }

  static async create({ input }) {
    const {
      genre: genreInput,
      title,
      year,
      director,
      duration,
      poster,
      rate,
    } = input;
    const [uuidResult] = await connection.query("SELECT UUID() uuid;"); //Genera un UUID con mysql
    const [{ uuid }] = uuidResult;

    const genres = Array.isArray(genreInput) ? genreInput : [genreInput];
    try {
      await connection.query(
        `INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
        [uuid, title, year, director, duration, poster, rate]
        //Se podría pasar el uuid directamente como variable ya que esto no lo ingresa el usuario con ${uuid} dentro del query
      );
      for (const genre of genres) {
        console.log(genre);
        await connection.query(
          `INSERT INTO movie_genres (movie_id, genre_id) SELECT UUID_TO_BIN(?), genre.id FROM genre WHERE name = ?;`,
          [uuid, genre]
        );
      }
    } catch (error) {
      throw new Error("Error al crear una película"); //Recomendado no mostrar el error exacto al usuario, sino un mensaje genérico
      // y controlar el error en un log
    }

    const [movies] = await connection.query(
      "SELECT title, year, director, duration, poster, rate FROM MOVIE WHERE id = UUID_TO_BIN(?);",
      [uuid]
    );
    return movies[0];
  }

  static async update({ id, input }) {
    const [current] = await connection.query(
      `SELECT m.title, m.year, m.director, m.duration, m.poster, GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') as Genres, m.rate, BIN_TO_UUID(m.id) AS ID 
      FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON g.id = mg.genre_id WHERE BIN_TO_UUID(m.id) = ? GROUP BY m.id;`,
      [id]
    );
    const currentMovie = current[0];
    if (currentMovie.length === 0) {
      return null;
    }

    const {
      genres = currentMovie.Genres,
      title = currentMovie.title,
      year = currentMovie.year,
      director = currentMovie.director,
      duration = currentMovie.duration,
      poster = currentMovie.poster,
      rate = currentMovie.rate,
    } = input;
    //console.log(current[0])
    console.table({ genres, title, year, director, duration, poster, rate });
    const generos = Array.isArray(genres) ? genres : [genres];
    await connection.query(
      "UPDATE movie SET title = ?, year = ?, director = ?, duration = ?, poster = ?, rate = ? WHERE id = UUID_TO_BIN(?);",
      [title, year, director, duration, poster, rate, id]
    );
    for (const genre of generos) {
      console.log(genre);
      await connection.query(
        "UPDATE movie_genres SET genre_id = (SELECT id FROM genre WHERE name = ?) WHERE movie_id = UUID_TO_BIN(?);",
        [genre, id]
      );
    }
    const [movies] = await connection.query(
      `SELECT m.title, m.year, m.director, m.duration, m.poster, GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') as Genres, m.rate, BIN_TO_UUID(m.id) AS ID 
      FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON g.id = mg.genre_id WHERE BIN_TO_UUID(m.id) = ? GROUP BY m.id;`,
      [id]
    );
    return movies[0];
  }

  static async delete({ id }) {
    const movie = await connection.query(
      `SELECT m.title, m.year, m.director, m.duration, m.poster, GROUP_CONCAT(g.name ORDER BY g.name SEPARATOR ', ') as Genres, m.rate, BIN_TO_UUID(m.id) AS ID 
      FROM movie m JOIN movie_genres mg ON m.id = mg.movie_id JOIN genre g ON g.id = mg.genre_id WHERE BIN_TO_UUID(m.id) = ? GROUP BY m.id;`,
      [id]
    );

    if (movie.length === 0) {
      return null;
    }

    await connection.query(
      `DELETE FROM movie WHERE id = UUID_TO_BIN(?);`,
      [id]
    );

    await connection.query(
      `DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);`,
      [id]
    );
    console.log(movie[0]);
    return true;
  }
}
