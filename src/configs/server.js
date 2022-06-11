/*

- server.js -
Modulo de configuraciones del servidor de la aplicacion

*/

require('dotenv').config();

module.exports = {
  host: process.env.SERVER_HOST || 'localhost',
  port: process.env.SERVER_PORT || 4000 // Puerto donde se ejecuta la aplicacion
};
