/*

- custom-round.js -
Modulo de redondeo de cifras personalizado

*/

module.exports = function (number, decimals) {
  // Validar que las entradas sean numericas
  if (typeof number !== 'number' && typeof decimals !== 'number') return null;

  return Number.parseFloat(number.toFixed(decimals));
}
