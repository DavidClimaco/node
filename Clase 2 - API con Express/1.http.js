const http = require("node:http");
const desiredPort = process.env.PORT ?? 1234;

const processRequest = (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (req.url === "/") {
    res.statusCode = 200; //OK
    res.end("<h1>Bienvenido a  mi página de inicio</h1>");
  } else if (req.url === "/contacto") {
    res.statusCode = 200; //OK
    res.end("<h1>Contacto</h1>");
  } else {
    res.statusCode = 404;

    res.end("<h1>404 Not found</h1>");
  }
};
const server = http.createServer(processRequest);

server.listen(desiredPort, () => {
  console.log(`Server is running on port ${desiredPort}`);
});
