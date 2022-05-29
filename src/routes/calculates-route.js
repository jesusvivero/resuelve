// importamos el controlador de calculate
const { calculatePlayerSalary, calculateTeamsSalary } = require('../controllers/calculates-controller');

// Exportamos todas las rutas de calculo
module.exports = (app) => {
  app.post('/calculate/players/', calculatePlayerSalary);
  app.post('/calculate/teams/', calculateTeamsSalary);
};
