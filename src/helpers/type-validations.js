function validateObjectProperty(object, property){
  return (typeof object !== 'undefined' && object.hasOwnProperty(property));
}

function validateNumber(number) {
  //console.log(typeof number);
  return (typeof number === 'number'/* && !isNaN(number)*/);
}

function validateIngeter(number) {
  if (!validateNumber(number)) return false;
  return (number % 1 === 0);
}


module.exports = {
  validateObjectProperty,
  validateNumber,
  validateIngeter
}
