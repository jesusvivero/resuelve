/*

- calculates-route.js -
Modulo de de definicion de rutas

*/

// importamos el controlador de calculate
const { calculatePlayerSalary, calculateTeamsSalary } = require('../controllers/calculates-controller');

// Exportamos todas las rutas de calculo
module.exports = (app) => {

  // Ruta para el calculo de sueldos por lista de jugadores
  app.post('/calculate/players/', calculatePlayerSalary);

  // Ruta para el calculo de sueldos por lista de equipos
  app.post('/calculate/teams/', calculateTeamsSalary);
};
