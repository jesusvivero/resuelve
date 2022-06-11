/*

- json-validations.js -
Modulo de validaciones de los datos JSON para el calculo de los salarios de los jugadores

*/

const { validateObjectProperty, validateNumber, validateIngeter } = require('../helpers/type-validations');
//const { getCurrentTeamLevel } = require('../services/teams-levels-service');



// Para validar los datos de las listas de niveles
function validateLevelsData(levels) {

  // Validar que los niveles sean un array
  if (!Array.isArray(levels) || levels.length === 0)
    return `La lista de niveles no tiene el formato apropiado.`;

  // Recorremos todos los niveles del equipo
  for (let level of levels) {

    // Validar que contenga una propiedad del nivel y que sea texto
    if (!validateObjectProperty(level, 'nivel'))
      return `No se encontró la propiedad <nivel> en la lista de niveles.`;

    if ((typeof level.nivel).toLowerCase() !== 'string')
      return `El nivel <${level.nivel}> de la lista de niveles no tiene el formato apropiado.`;

    // Validar que tenga la propiedad de goles del nivel y sea un valor numérico entero y positivo
    if (!validateObjectProperty(level, 'goles'))
      return `No se encontró la propiedad <goles> del nivel '${level.nivel}'.`;

    if ((typeof level.goles).toLowerCase() !== 'number')
      return `La cantidad de goles del nivel '${level.nivel}' no es numérica.`;

    if (!validateIngeter(level.goles) || level.goles < 0)
      return `La cantidad de goles <${level.goles}> del nivel '${level.nivel}' no es un número entero positivo.`;

  };

  return 'OK'; // retorna 'OK' si todo está bien.

} // end: function validateLevelsData(levels) {



// Para validar los datos necesarios de la lista de jugadores
function validatePlayersData(players, teamName) {

  // Validar que player sea un array
  if (!Array.isArray(players) || players.length === 0)
    return 'La lista de jugadores no está definida o no tiene el formato apropiado';

  // Se recorre el listado de jugadores para validación
  for (player of players) {

    const playerTeam = player.equipo !== undefined ? player.equipo : teamName; // Si el jugador no tiene el equipo se toma el parametro de entrada

    // Validar el nombre del jugador
    if (!validateObjectProperty(player, 'nombre'))
      return 'No se encontró la propiedad <nombre> del jugador.';

    if ((typeof player.nombre).toLowerCase() !== 'string' || player.nombre === "")
      return `El nombre <${player.nombre}> del jugador no tiene el formato apropiado.`;


    // Validar los goles del jugador
    if (!validateObjectProperty(player, 'goles'))
      return `No se encontró la propiedad <goles> del jugador '${player.nombre}'.`;

    if ((typeof player.goles).toLowerCase() !== 'number')
      return `La cantidad de goles que marcó el jugador '${player.nombre}' no es numérica.`;

    if (!validateIngeter(player.goles) || player.goles < 0)
      return `La cantidad de goles <${player.goles}> que marcó el jugador '${player.nombre}' no es un número entero positivo.`;


    // Validar el nivel del jugador
    if (!validateObjectProperty(player, 'nivel'))
      return `No se encontró la propiedad <nivel> del jugador '${player.nombre}'.`;

    if ((typeof player.nivel).toLowerCase() !== 'string' || player.nivel === "")
      return `El nivel <${player.nivel}> del jugador '${player.nombre}' no tiene el formato apropiado.`;


    // Validar el equipo del jugador
    if (!playerTeam)
      return`No se definió el equipo del jugador '${player.nombre}'.`;

    if ((typeof playerTeam).toLowerCase() !== 'string' || playerTeam === "")
      return `El equipo del jugador '${player.nombre}' no tiene el formato apropiado.`;


    // Validar el sueldo del jugador
    if (!validateObjectProperty(player, 'sueldo'))
      return `No se encontró la propiedad <sueldo> del jugador '${player.nombre}'.`;

    if ((typeof player.sueldo).toLowerCase() !== 'number')
      return `El sueldo del jugador '${player.nombre}' no es numérico.`;

    if (!validateNumber(player.sueldo) || player.sueldo < 0)
      return `El Sueldo <${player.sueldo}> del jugador '${player.nombre}' no es un número positivo.`;

    // Validar el bono del jugador
    if (!validateObjectProperty(player, 'bono'))
      return `No se encontró la propiedad <bono> del jugador '${player.nombre}'.`;

    if ((typeof player.bono).toLowerCase() !== 'number')
      return `El bono del jugador '${player.nombre}' no es numérico.`;

    if (!validateNumber(player.bono) || player.bono < 0)
      return `El Bono <${player.bono}> del jugador '${player.nombre}' no es un número positivo.`;

  };

  return 'OK'; // retorna 'OK' si todo está bien

} // end: function validatePlayersData(players, teamName) {



// Para validar los datos necesarios de la lista de equipos
function validateTeamsData(teams, requiredLevels, requiredPlayers) { //withPlayer: true o false para validar o no si el equipo tiene lista de jugadores incluida

  // Validar que player sea un array
  if (!Array.isArray(teams) || teams.length === 0)
    return 'La lista de equipos no tiene el formato apropiado';

  // Recorrer la lista de equipos recibida
  for (team of teams) {

    // Validar que tenga nombre el equipo
    if (!validateObjectProperty(team, 'nombre'))
      return 'No se encontró la propiedad <nombre> del equipo';

    if ((typeof team.nombre).toLowerCase() !== 'string' || team.nombre === "")
      return `El nombre <${team.nombre}> del equipo no tiene el formato apropiado.`;

    // Verificar si el equipo trae la lista de niveles incluida
    if (validateObjectProperty(team, 'niveles')) {
      const res = validateLevelsData(team.niveles); // Validar la estructura definida para la lista de niveles del equipo
      if (res !== 'OK') return `Error en equipo '${team.nombre}': ${res}`;
    } else {
      if (requiredLevels) return `No se encontró la propiedad <niveles> del equipo '${team.nombre}'`;
    }


    // Si se debe validar lista de jugadores
    if (requiredPlayers) {
      // Validar lista de jugadores
      if (!validateObjectProperty(team, 'jugadores'))
        return `No se encontró la propiedad <jugadores> del equipo '${team.nombre}'.`;

      const res = validatePlayersData(team.jugadores, team.nombre);
      if (res !== 'OK') return `Error en equipo '${team.nombre}': ${res}`;

    }

  };

  return 'OK'; // retorna 'OK' si todo está bien

} // end: function validateTeamsData(teams, withPlayers) {



module.exports = {
  validateLevelsData,
  validatePlayersData,
  validateTeamsData
}
