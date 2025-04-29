const express = require("express");
const app = express();
const movies = require("./movies.json");
const crypto = require("node:crypto");
const z = require("zod");
const PORT = process.env.PORT ?? 1234;

app.disable("x-powered-by");

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hola mundo" });
});

//GET ALL MOVIES
app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

//GET MOVIE BY ID
app.get("/movies/:id", (req, res) => {
  //path-to-regexp
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) {
    return res.json(movie);
  }

  res.status(404).json({ message: "Movie not found" });
});

//POST
app.post("/movies", (req, res) => {
  const movieSchema = z.object({
    title: z.string({
      invalid_type_error: "Movie title must be a string",
      required_error: "Movie title is required",
    }),
    year: z.number().int().positive().min(1900).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10),
    poster: z.string().url({
      message: "Poster must be a valid URL",
    }),
    genre: z.array(
      z.enum([
        "Action",
        "Drama",
        "Adventure",
        "Comedy",
        "Fantasy",
        "Horror",
        "Thriller",
        "Sci-Fi",
        {
          required_error: "Movie genre is required",
          invalid_type_error: "Movie genre must be an array of enum Genre",
        },
      ])
    ),
  });
  const { title, genre, year, director, duration, rate, poster } = req.body;
  const newMovie = {
    id: crypto.randomUUID(),
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 0,
    poster,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
