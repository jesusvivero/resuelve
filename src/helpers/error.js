/*

- error.js -
Modulo de generacion de excepcion personalizada

*/

function genError(message, name) {
  const err = new Error(message);
  err.name = name || 'Error';
  throw err;
}

module.exports = genError;
