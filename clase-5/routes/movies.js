import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const moviesRouter = Router();
//GET ALL MOVIES
moviesRouter.get(
  "/",
  MovieController.getAll
  // const origin = req.header("origin"); //Forma manual con Node.js
  // if(ACCEPTED_ORIGINS.includes(origin) || !origin){ //La página origin no envía el header por lo tanto se no existe se le da acceso por default
  //   res.header("Access-Control-Allow-Origin", origin);
  // }
);

//Get movie by id
moviesRouter.get("/:id", MovieController.getById);

//POST MOVIE
moviesRouter.post("/", MovieController.create);

//PATCH MOVIE
moviesRouter.patch("/:id", MovieController.update);

//DELETE MOVIE
moviesRouter.delete("/:id", MovieController.delete);
