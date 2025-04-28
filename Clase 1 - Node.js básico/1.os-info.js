const os = require('node:os');

console.log('Información del sistema: ');
console.log('-------------------');
console.log('Sistema operativo:', os.platform());
console.log('Versión del sistema operativo:', os.release());
console.log('Arquitectura del sistema:', os.arch());
console.log('Número de núcleos de CPU:', os.cpus().length);
console.log('Memoria total:', os.totalmem() / 1024 / 1024, 'MB');
