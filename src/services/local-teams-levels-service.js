const { validateObjectProperty } = require('../helpers/type-validations');
const { validateTeamsData } = require('../helpers/json-validations');


// Metodo para obtener el objeto con las definiciones locales de niveles por equipo
const getLocalTeamsLevels = () => {

  try {

    const jsonData = require('../data/teams-levels-example2.json'); // Cargar JSON con la configuracion de niveles por equipo
    //console.log(jsonData);

    // Validar que contenga los equipos
    if (!validateObjectProperty(jsonData, 'equipos')) {
      console.log('No se encontró la propiedad <equipos> en el archivo local de niveles de equipos.')
      return;
    }

    // Validar que el JSON de niveles locales esté correcto
    const res = validateTeamsData(jsonData.equipos, false);

    if (res !== 'OK') {
      console.log(`[Archivo local de niveles de equipos] ${res}`);
      return;
    }
    console.log('Archivo de configuración de niveles por equipo: OK.');
    return jsonData.equipos.slice(); // Devuelve el objeto con las configuraciones si esta valido

  } catch (err) {

    console.log('Error cargando archivo de niveles por equipos: ', err.message);
    return;

  }

}



const localTeamsLevels = getLocalTeamsLevels(); // Se carga la lista de configuracion de equipos
//console.log(teamsList);

module.exports = localTeamsLevels; // Se carga la lista de configuracion de equipos
