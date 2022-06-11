/*

- index.js -
Modulo para agrupar rutas

*/

// Importamos y ejecutamos una instancia de aplicacion
const app = require('express')();

const calculatesRoute = require('./calculates-route'); // Rutas de Calculate

calculatesRoute(app); // Le agregamos las rutas de Calculate a la app

module.exports = app;
