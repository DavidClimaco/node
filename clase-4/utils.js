import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export const readJSON = (path) => require(path); //Función para leer archivos json que se puede exportar