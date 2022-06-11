/*

- send-response.js -
Modulo para retornar respuestas al frontend

*/

// Funcion para retornar mensajes al frontend
function sendResponse(req, res, props) {

  const { status, message, error } = props; // Extraer los datos necesarios para la respuesta

  const data = { // Armar el objeto de respuesta
    status,
    message,
  }

  // Indicar que tipo de respuesta es
  if (error) {
    data.error = error;
  } else {
    data.success = !error;
  }

  // Retornar la respuesta
  if (status) {
    return res.status(status).json(data);
  } else {
    return res.json(data);
  }

}

// Funcion para retornar mensajes de exito al frontend
function sendSuccessResponse(req, res, message, status) {

  sendResponse(req, res, { message, status, error: false });

}

// Funcion para retornar mensajes de error al frontend
function sendErrorResponse(req, res, message, status) {

  sendResponse(req, res, { message, status, error: true });

}

module.exports = {
  sendResponse,
  sendSuccessResponse,
  sendErrorResponse
}
