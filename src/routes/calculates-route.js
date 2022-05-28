// importamos el controlador de calculate
const { calculateSalary } = require('../controllers/calculates-controller');

// Exportamos todas las rutas de calculo
module.exports = (app) => {
  app.post('/calculate/', calculateSalary);
};
