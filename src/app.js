/* Declaraciones */
const express = require('express');


const server = require('./configs/server');
const { sendErrorResponse } = require('./helpers/send-response');



/* Inicializaciones */
const app = express();


/* Configuraciones */
app.set('port', 4000);



/* Middlewares */
app.use(express.json()); // Para que la API trabaje con JSONs
app.use(express.urlencoded({ extended: false })); // Indicamos que solo lea datos simples


/* Metodos */
app.start = () => {
  try {
    app.listen(app.get('port'), () => {
      console.log('Server on port:', app.get('port'));
    });
  } catch (err) {
    console.error(err);
  }
};


module.exports = app;
