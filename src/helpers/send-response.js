// Funcion para retornar mensajes al frontend
function sendResponse(req, res, props) {

  const { status, message, error } = props;

  const data = {
    status,
    message,
  }

  if (error) {
    data.error = error;
  } else {
    data.success = !error;
  }

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
