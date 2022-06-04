const { validateObjectProperty, validateNumber, validateIngeter } = require('../helpers/type-validations');
const { getCurrentTeamLevel } = require('../data/teams-levels');





// Para validar los datos necesarios de la lista de jugadores
function validatePlayersData(players, teamName) {

  // Validar que player sea un array
  if (!Array.isArray(players) || players.length === 0)
    genError('La lista de jugadores es inválida');

  // Se recorre el listado de jugadores para validación
  players.map(player => {

    //const playerName = player.nombre; // Si no viene la propiedad del nombre la seteamos vacia
    const playerTeam = player.equipo || teamName; // Si el jugador no tiene el equipo se toma el parametro de entrada

    // Validar el nombre del jugador
    if (!validateObjectProperty(player, 'nombre'))
      genError('No se encontró la propiedad <nombre> del jugador.');

    if ((typeof player.nombre).toLowerCase() !== 'string' || player.nombre === "")
      genError(`El nombre <${player.nombre}> del jugador es inválido.`);


    // Validar los goles del jugador
    if (!validateObjectProperty(player, 'goles'))
      genError(`No se encontró la propiedad <goles> del jugador '${player.nombre}'.`);

    if ((typeof player.goles).toLowerCase() !== 'number')
      genError(`La cantidad de goles que marcó el jugador '${player.nombre}' no es numérica.`);

    if (!validateIngeter(player.goles) || player.goles < 0)
      genError(`La cantidad de goles <${player.goles}> que marcó el jugador '${player.nombre}' es inválida.`);


    // Validar el nivel del jugador
    if (!validateObjectProperty(player, 'nivel'))
      genError(`No se encontró la propiedad <nivel> del jugador '${player.nombre}'.`);

    if ((typeof player.nivel).toLowerCase() !== 'string' || player.nivel === "")
      genError(`El nivel <${player.nivel}> del jugador '${player.nombre}' es inválido.`);


    // Validar el equipo del jugador
    if (!playerTeam)
      genError(`No se definió el equipo del jugador '${player.nombre}'.`);

    if ((typeof playerTeam).toLowerCase() !== 'string' || playerTeam === "")
      genError(`El equipo del jugador '${player.nombre}' es inválido.`);


    // Validar el sueldo del jugador
    if (!validateObjectProperty(player, 'sueldo'))
      genError(`No se encontró la propiedad <sueldo> del jugador '${player.nombre}'.`);

    if ((typeof player.sueldo).toLowerCase() !== 'number')
      genError(`El sueldo del jugador '${player.nombre}' no es numérico.`);

    if (!validateNumber(player.sueldo) || player.sueldo < 0)
      genError(`El Sueldo <${player.sueldo}> del jugador '${player.nombre}' es inválido.`);

    // Validar el bono del jugador
    if (!validateObjectProperty(player, 'bono'))
      genError(`No se encontró la propiedad <bono> del jugador '${player.nombre}'.`);

    if ((typeof player.bono).toLowerCase() !== 'number')
      genError(`El bono del jugador '${player.nombre}' no es numérico.`);

    if (!validateNumber(player.bono) || player.bono < 0)
      genError(`El Bono <${player.bono}> del jugador '${player.nombre}' es inválido.`);

    // Validar el nivel del jugador este permitido en la lista de configuracion del equipo
    const currentTeamLevel = getCurrentTeamLevel(playerTeam, player.nivel); // Se obtiene el nivel del jugador dentro de los niveles de su equipo
    console.log(currentTeamLevel);
    if (!currentTeamLevel)
      genError(`El nivel <${player.nivel}> del jugador '${player.nombre}' no está definido en los parámetros de medición para el equipo <${playerTeam}>`);

  });

  return true; // retorna true si todo está ok

} // end: function validatePlayersData(players, teamName) {


// Para validar los datos necesarios de la lista de equipos
function validateTeamsData(teams) {

  // Validar que player sea un array
  if (!Array.isArray(teams) || teams.length === 0)
    genError('La lista de equipos es inválida');

  // Recorrer la lista de equipos recibida
  const teamsResult = teams.map(team => {

    // Validar que tenga nombre el equipo
    if (!validateObjectProperty(team, 'nombre'))
      genError('No se encontró la propiedad <nombre> del equipo');

    if ((typeof team.nombre).toLowerCase() !== 'string' || team.nombre === "")
      genError(`El nombre <${team.nombre}> del equipo es inválido.`);


    // Validar lista de jugadores
    if (!validateObjectProperty(team, 'jugadores'))
      genError(`No se encontró la propiedad <jugadores> del equipo '${team.nombre}'.`);

    if (!validateObjectProperty(team, 'jugadores') || !Array.isArray(team.jugadores) || team.jugadores.length === 0)
      genError(`La lista de jugadores <${team.jugadores}> del equipo '${team.nombre}' es inválida.`);

    return validatePlayersData(team.jugadores, team.nombre);

  });

  return true; // retorna true si todo está ok

} // end: function validateTeamsData(teams) {



module.exports = {
  validatePlayersData,
  validateTeamsData
}
