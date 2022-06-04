const { validateObjectProperty, validateIngeter } = require('../helpers/type-validations');


// Funcion para validar la estructura del archivo de configuraciones de los niveles por equipos
function isValidTeamsLevels(dataTeamsLevels) {

  // Validar que contenga los equipos
  if (!validateObjectProperty(dataTeamsLevels, 'teams')) return false;

  // Validar que los equipos estén configurados como array
  if (!Array.isArray(dataTeamsLevels.teams) || dataTeamsLevels.teams.length === 0) return false;

  // Recorremos todos los equipos
  const dataTeamsLevelsResult = dataTeamsLevels.teams.filter(team => {

    // Validar que cada equipo contenga un nombre
    if (!validateObjectProperty(team, 'name') || typeof team.name !== 'string') return false;

    // Validar que tenga una propiedad de niveles y que sea un array
    if (!validateObjectProperty(team, 'levels') || !Array.isArray(team.levels) || team.levels.length === 0) return false;

    // Recorremos todos los niveles del equipo
    const levelsResult = team.levels.filter(lev => {

      // Validar que contenga una propiedad del nivel y que sea texto
      if (!validateObjectProperty(lev, 'level') || typeof lev.level !== 'string') return false;

      // Validar que tenga la propiedad de goles del nivel y sea un valor numérico entero y positivo
      if (!validateObjectProperty(lev, 'goals') || !validateIngeter(lev.goals) || lev.goals < 0) return false;
      return true; // Solo se retorna el elemento del array si todas las propiedades del nivel están correctas.
    });

    // Si el array resltante tiene la misma dimension del original de niveles quiere decir que está correcto el nivel y todo el equipo
    if (levelsResult.length !== team.levels.length) return false;
    return true;// Solo se retorna el elemento del array si todas las propiedades del equipo están correctas.
  });

  // Si el array resltante tiene la misma dimension del original de equipos quiere decir que está correcto el equipo
  if (dataTeamsLevelsResult.length !== dataTeamsLevels.teams.length) return false;
  return true; // Se retorna true si la validación del archivo fue exitosa

} // end: function validateTeamsLevels(dataTeamsLevels) {


// Metodo para obtener el objeto con las definiciones de niveles por equipo
const getTeamsLevels = () => {

  try {
    const jsonData = require('../data/teams-levels-bad.json'); // Cargar JSON con la configuracion de niveles por equipo
    //console.log(jsonData);
    if (isValidTeamsLevels(jsonData)) {
      console.log('Archivo de configuraciones de niveles por equipo: OK.');
      return jsonData.teams.slice(); // Devuelve el objeto con las configuraciones si esta valido
    }
    console.log('El archivo de configuracion de niveles por equipo posee una estructura inválida.');
    return;
  } catch (err) {
    console.log('Error inesperado cargando archivo de niveles por equipos: ', err.message);
    return;
  }

}



const teamsList = getTeamsLevels(); // Se carga la lista de configuracion de equipos
//console.log(teamsList);



// Retorna la informacion de nivel segun equipo y el nivel dado al jugador
const getCurrentTeamLevel = (playerTeam, playerLevel) => {

  //console.log(teamsList);
  if (!teamsList) return;

  const team = teamsList.find(team => (team.name === playerTeam));
  if (!team) return;

  const level = team.levels.find(({ level }) => (level === playerLevel));
  return level;

};



module.exports = {
  teamsList,
  getCurrentTeamLevel
};
