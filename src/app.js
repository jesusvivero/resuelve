/* Declaraciones */
const express = require('express');


const server = require('./configs/server');
const { sendErrorResponse } = require('./helpers/send-response');
const appRoutes = require('./routes'); // Cargamos la rutas definidas en el index de rutas


/* Inicializaciones */
const app = express();


/* Configuraciones */
app.set('port', server.port);



/* Middlewares */
app.use(express.json()); // Para que la API trabaje con JSONs
app.use(express.urlencoded({ extended: false })); // Indicamos que solo lea datos simples
app.use('/api', appRoutes); // Le agregamos las rutas a la app


// Para que todos los errores capturados se impriman en la consola del servidor
app.use((err, req, res, next) => {
  console.log(err);
  next();
});
app.use((err, req, res, next) => {
  sendErrorResponse(req, res, err.message || err)
});

/* Metodos */
app.start = () => { // Para iniciar la app
  try {
    app.listen(app.get('port'), () => {
      console.log(`Server on http://localhost:${app.get('port')}/`);
    });
  } catch (err) {
    console.error(err);
  }
};


module.exports = app;
