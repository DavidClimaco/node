import { readJSON } from "../utils.js";
import { randomUUID } from "node:crypto";

const movies = readJSON("./movies.json");

export class MovieModel {
  static getAll = async ({ genre }) => {
    //Una forma de hacerlo async await con flecha
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    return movies;
  };

  //Se utiliza {id} porque es más fácil de actualizar si la función se modifica
  static async getById({ id }) {
    //async await con función normal
    const movie = movies.find((movie) => movie.id === id); //function(movie) {return movie.id === id} es igual a esto
    return movie;
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(), //uuid v4
      ...input,
    };
    movies.push(newMovie);
    return newMovie;
  }

  static async update({ id, input }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    movies[movieIndex] = {
      ...movies[movieIndex],
      ...input,
    };
    return movies[movieIndex];
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id === id);
    if (movieIndex === -1) return false;
    movies.splice(movieIndex, 1);
    return true;
  }
}
