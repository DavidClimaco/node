import cors from "cors";

//Sitios web que pueden acceder a mi API
const ACCEPTED_ORIGINS = [
  "http://localhost:1234",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://moviesapi.com",
];
export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }
      if (!origin) {
        return callback(null, true);
      }
      //return callback(new Error("Not allowed by CORS")); //Probar como devolver un error, ya que con esto daba error en consolade vscode
    },
  });
