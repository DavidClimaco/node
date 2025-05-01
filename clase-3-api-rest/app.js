const express = require("express");
const app = express();
const movies = require("./movies.json");
const crypto = require("node:crypto");
const z = require("zod");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");
const PORT = process.env.PORT ?? 1234;
const cors = require("cors");

//Sitios web que pueden acceder a mi API
const ACCEPTED_ORIGINS = [
  "http://localhost:1234",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://moviesapi.com",
];

app.disable("x-powered-by");
app.use(
  cors({
    origin: (origin, callback) => {
      if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
        callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      }
      //return callback(new Error("Not allowed by CORS")); //Probar como devolver un error, ya que con esto daba error en consolade vscode
    },
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Hola mundo" });
});

//GET ALL MOVIES
app.get("/movies", (req, res) => {
  // const origin = req.header("origin"); //Forma manual con Node.js
  // if(ACCEPTED_ORIGINS.includes(origin) || !origin){ //La página origin no envía el header por lo tanto se no existe se le da acceso por default
  //   res.header("Access-Control-Allow-Origin", origin);
  // }
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
  const result = validateMovie(req.body);
  // const { title, genre, year, director, duration, rate, poster } = req.body;

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(), //uuid v4
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

//PATCH
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updatedMovie = { ...movies[movieIndex], ...result.data };

  movies[movieIndex] = updatedMovie;
  return res.json(updatedMovie);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
