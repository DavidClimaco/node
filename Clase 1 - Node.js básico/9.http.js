const http = require("node:http");
const { findAvailablePort } = require("./10.free-port.js");

const server = http.createServer((req, res) => {
  console.log("Request received");
  res.end("Hello World");
});

findAvailablePort(1234).then(port => {
  server.listen(port, () => {
    // Asigna el primer puerto disponible, no es recomendable para producción
    console.log(`Server is running on port ${port}`);
  });
});
