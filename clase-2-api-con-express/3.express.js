const express = require("express");
const app = express();
const ditto = require("./pokemon/ditto.json");

const port = process.env.PORT ?? 1234;
app.disable("x-powered-by"); //Deshabilitar cabecera donde indica la tecnología, puede llegar a ser una vulnerabilidad

//Este middleware se puede resumir gracias a express
app.use(express.json());
// app.use((req, res, next) => {
//   if (req.method !== "POST") {
//     return next();
//   }
//   if (req.headers["content-type"] !== "application/json") {return next()}
//     //Request que solo tienen POST y content-type: application/json
//     let body = "";

//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });

//     req.on("end", () => {
//       const data = JSON.parse(body);
//       data.timestamp = Date.now();
//       //Mutar la request y meter la información en el body
//       req.body = data;
//       next();
//     });
// });

app.get("/", (req, res) => {
  res.status(200).send("<h1>Mi página de inicio </h1>");
});

app.get("/pokemon/ditto", (req, res) => {
  res.json(ditto);
  res.status(200).send(ditto);
});

app.post("/pokemon", (req, res) => {
  //Con req.body se debería guardar en la base de datos
  req.body.timestamp = Date.now(); //Ya que data no está se aplica al req.body
  res.status(201).json(req.body);
});

app.use(express.static("public")); //Se puede agregar un prefijo antes: app.use("/prefix", express.static("public"));

//Error 404, última página que intenta localizar
app.use((req, res) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
