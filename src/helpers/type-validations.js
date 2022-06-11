/*

- type-validations.js -
Modulo de funciones para validar tipos de datos

*/

// Para validar si un objeto tiene una propiedad especifica
function validateObjectProperty(object, property) {
  return ((typeof object).toLowerCase() !== 'undefined' && object.hasOwnProperty(property));
}

// Validar si es numerico
function validateNumber(number) {
  return ((typeof number).toLowerCase() === 'number');
}

// Validar si es numerico y entero
function validateIngeter(number) {
  if (!validateNumber(number)) return false;
  return (number % 1 === 0);
}


module.exports = {
  validateObjectProperty,
  validateNumber,
  validateIngeter
}
