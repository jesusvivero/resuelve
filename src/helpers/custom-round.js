module.exports = function (number, decimals) {
  //if (isNaN(number) || isNaN(decimals)) return null;
  if (typeof number !== 'number' && typeof decimals !== 'number') return null;
  //return Number(Math.round(number + `e${decimals}`) + `e-${decimals}`);
  return Number.parseFloat(number.toFixed(decimals));
}
