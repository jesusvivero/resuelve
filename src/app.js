/*

- app.js -
Modulo principal de definicion de los procesos y configuraciones de la aplicacion

*/

/* Declaraciones */
const express = require('express'); // Framework para el manejo de nuestra aplicacion
//
const server = require('./configs/server'); // Configuraciones del servidor
const { sendErrorResponse } = require('./helpers/send-response'); // Procesos de respuesta
const appRoutes = require('./routes'); // Cargamos la rutas definidas en el index de rutas


/* Inicializaciones */
const app = express(); // Iniciamos la aplicacion


/* Configuraciones */
app.set('host', server.host); // Se define el puerto donde se ejecutara la aplicacion
app.set('port', server.port); // Se define el puerto donde se ejecutara la aplicacion


/* Middlewares */
app.use(express.json()); // Para que la API trabaje con JSONs
app.use(express.urlencoded({ extended: false })); // Indicamos que solo lea datos simples
app.use('/api', appRoutes); // Le asignamos las rutas a la aplicacion

// Para que todos los errores capturados se impriman en la consola del servidor
app.use((err, req, res, next) => {
  console.log(err.message || err);
  next(err);
});
// Para que todos los errores capturados se devuelvan al frontend
app.use((err, req, res, next) => {
  sendErrorResponse(req, res, err.message || err)
});


/* Metodos */
app.start = () => { // Para iniciar la app
  try {
    app.listen(app.get('port'), () => {
      console.log(`Server on http://${app.get('host')}:${app.get('port')}/`);
    });
  } catch (err) {
    console.error(err);
  }
};


module.exports = app;
