/*

- calculates-controller.js -
Modulo encargado de los procesos de cada ruta del API para calcular los salarios

*/

const customRound = require('../helpers/custom-round');
const localTeamsLevels = require('../services/local-teams-levels-service');
const { getCurrentTeamLevel } = require('../services/teams-levels-service');
const genError = require('../helpers/error');

const { validatePlayersData, validateTeamsData } = require('../helpers/json-validations');
const { validateObjectProperty } = require('../helpers/type-validations');

// Declaracion del controlador que sera exportado
const controller = {};



// Proceso para calcular los sueldos de la lista de jugadores
//const calculateSalaries = (players, teamName, teamLevels) => {
const calculateSalaries = (players, teamName, teamslevelList) => {

  const teamsTotals = new Object(); // Objeto de niveles por equipos
  let playersResult; // Para el Array de jugadores mutable

  // Ciclo para calcular el puntaje global por equipo y el procentaje personal del jugador
  playersResult = players.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const playerName = player.nombre;
    const playerGoals = player.goles;
    const playerLevel = player.nivel;
    const playerTeam = player.equipo !== undefined ? player.equipo : teamName; // Si el jugador no tiene el equipo se toma el parametro de entrada

    let levels = [];
    if (teamslevelList) {
      levels = teamslevelList.slice();
    } else {
      levels = localTeamsLevels && localTeamsLevels.slice();
    }

    if (!levels) return genError(`No se definió ni se encontró en el sistema una lista de niveles para el equipo '${playerTeam}.'`);
    //

    const currentTeamLevel = getCurrentTeamLevel(levels, playerTeam, playerLevel); // Se obtiene el nivel del jugador dentro de los niveles de su equipo

    if (!currentTeamLevel) return genError(`El nivel <${playerLevel}> del jugador '${playerName}' no está definido en los parámetros de medición para el equipo <${playerTeam}>`);

    if (!teamsTotals[playerTeam]) { // Si no esta definido el equipo en el objeto de acumulados totales, se establece el objeto con sus propiedades
      teamsTotals[playerTeam] = {
        totalPlayerGoals: 0,
        totalGoalsLevels: 0,
        get getGoalsPercentage() { // retorna el porcentaje de goles de jugadores del equipo por nivel sin superar el 100%
          const percentage = this.totalPlayerGoals / this.totalGoalsLevels;
          return percentage > 1 ? 1 : percentage;
        }
      };
    }

    // Acumular valores totales por equipo
    teamsTotals[playerTeam].totalPlayerGoals = (teamsTotals[playerTeam].totalPlayerGoals || 0) + playerGoals; // total goles de los jugadores dentro del equipo
    teamsTotals[playerTeam].totalGoalsLevels = (teamsTotals[playerTeam].totalGoalsLevels || 0) + currentTeamLevel.goles; // total de meta de goles de los jugadores segun nivel del equipo

    const playerData = {
      nombre: player.nombre,
      goles_minimos: currentTeamLevel.goles,
      goles: player.goles,
      sueldo: player.sueldo,
      bono: player.bono,
      sueldo_completo: player.sueldo_completo,
      get getGoalsPercentage() { // retorna el porcentaje de goles del jugador segun su nivel sin superar el 100%
        const percentage = this.goles / this.goles_minimos;
        return percentage > 1 ? 1 : percentage;
      }
    };

    if (validateObjectProperty(player, 'equipo')) playerData.equipo = player.equipo;

    return playerData; // Retorna los datos del jugador

  });

  // Ciclo para calcular la bonificación y el sueldo de cada jugador
  playersResult = playersResult.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const currentPlayer = Object.assign({}, player); // Para copiar el objeto y no la referencia (Solo si el objeto no posee subojetos)
    const playerSalary = currentPlayer.sueldo;
    const playerBonus = currentPlayer.bono;
    const playerTeam = currentPlayer.equipo || teamName;


    // Se calcula el procentaje del bono 50% equipo 50% personal
    const bonusPercentage = (teamsTotals[playerTeam].getGoalsPercentage + currentPlayer.getGoalsPercentage) / 2;

    const bonus = customRound(playerBonus * bonusPercentage, 2); // Calculo del bono del jugador

    // Se borran las propiedades despues de ser usadas en los calculos y que no se necesitan mostrar en la salida
    delete currentPlayer.getGoalsPercentage;

    return {
      ...currentPlayer, // Retorna el objeto con los datos del jugador
      sueldo_completo: customRound(playerSalary + bonus, 2) // Se calcula el sueldo total del jugador
    }

  });

  return playersResult;

}; // end: const calculateSalaries = (players, teamName, teamLevels) => {



// controlador para calcular el salario de los jugadores
controller.calculatePlayerSalary = (req, res, next) => {

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const teams = req.body.equipos;
  const players = req.body.jugadores; // Se obtiene el objeto con la información del JSON de datos de entrada
  //
  try {

    // Validar el JSON de jugadores
    let message = validatePlayersData(players);

    if (message !== 'OK') genError(message);

    // verificar si el JSON tiene equipos
    if (teams) {
      // Validar los equipos
      message = validateTeamsData(teams, true, false);
      if (message !== 'OK') genError(message);
    }

    const playersResult = calculateSalaries(players, null, teams); // Calcular los sueldos de la lista de jugadores
    return res.json(playersResult); // Retorna la respuesta al frontend

  } catch (err) {
    next(err); // Si ocurre una excepcion se ejecuta el middleware de errores
  }

} // end: controller.calculatePlayerSalary = (req, res, next) => {



// Controlador para calcular el salario de los jugadores por arreglo de equipos
controller.calculateTeamsSalary = (req, res, next) => {

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const teams = req.body.equipos; // Se obtiene el objeto con la información del JSON de datos de entrada

  try {

    // validar el JSON de equipos
    const message = validateTeamsData(teams, false, true);
    if (message !== 'OK') genError(message);

    // Recorrer la lista de equipos recibida
    const teamsResult = teams.map((team, index) => {

      // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
      const teamName = team.nombre;
      const teamLevels = team.niveles && [{nombre: team.nombre, niveles: team.niveles}];
      const teamPlayers = team.jugadores;

      const playersResult = calculateSalaries(teamPlayers, teamName, teamLevels); // Calcular los sueldos de la lista de jugadores

      return {
        nombre: teamName,
        jugadores: playersResult // La nueva lista de jugadores con los sueldos calculados
      };

    });

    res.json(teamsResult); // Retorna la respuesta al frontend

  } catch (err) {
    next(err); // Si ocurre una excepcion se ejecuta el middleware de errores
  }

}; // end: controller.calculateTeamsSalary = (req, res, next) => {



module.exports = controller; // Exportar el controlador
