import express, { json } from "express";
const app = express();
import { moviesRouter } from "./routes/movies.js";
const PORT = process.env.PORT ?? 1234;
import { corsMiddleware } from "./middlewares/cors.js";

//Como leer un archivo json en ES Modules
// import fs from "node:fs";
// const movies = JSON.parse(fs.readFileSync("./movies.json", "utf-8"));



//A futuro se podrá importar así, sigue en experimental
//import movies from "./movies.json" with {type: "json"};

// //Sitios web que pueden acceder a mi API
// const ACCEPTED_ORIGINS = [
//   "http://localhost:1234",
//   "http://localhost:5500",
//   "http://127.0.0.1:5500",
//   "http://moviesapi.com",
// ];

app.disable("x-powered-by");
app.use(corsMiddleware());

app.use(json());
app.get("/", (req, res) => {
  res.json({ message: "Hola mundo" });
});

app.use("/movies", moviesRouter);
// //GET ALL MOVIES
// app.get("/movies", todo);

// //GET MOVIE BY ID
// app.get("/movies/:id", todo);

// //POST
// app.post("/movies", todo);

// //PATCH
// app.patch("/movies/:id", todo);

// //DELETE
// app.delete("/movies/:id", todo);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
