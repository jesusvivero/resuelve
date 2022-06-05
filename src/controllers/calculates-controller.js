const customRound = require('../helpers/custom-round');
const localTeamsLevels = require('../services/local-teams-levels-service');
const { getCurrentTeamLevel } = require('../services/teams-levels-service');
const genError = require('../helpers/error');
//const { sendErrorResponse } = require('../helpers/send-response');

const { validatePlayersData, validateTeamsData } = require('../helpers/json-validations');
const { validateObjectProperty } = require('../helpers/type-validations');

// Declaracion del controlador que sera exportado
const controller = {};





// Proceso para calcular los sueldos de la lista de jugadores
//const calculateSalaries = (players, teamName, teamLevels) => {
const calculateSalaries = (players, forced, teamName, teamLevels) => {

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
    if (teamLevels) {
      levels.push({
        nombre: teamName,
        niveles: teamLevels
      });
    } else {
      //levels.push(localTeamsLevels.slice());
      levels = localTeamsLevels && localTeamsLevels.slice();
    }
    //const  = (team || localTeamsLevels);
    //
    //console.log('team', teamLevels);
    //console.log('local', localTeamsLevels);
    //console.log('union', levels);
    if (!levels) return genError(`No se definió ni se encontró en el sistema una lista de niveles para el equipo '${playerTeam}.'`);
    //
    const currentTeamLevel = getCurrentTeamLevel(levels, playerTeam, playerLevel); // Se obtiene el nivel del jugador dentro de los niveles de su equipo
    //console.log(currentTeamLevel);
    if (!currentTeamLevel) return genError(`El nivel <${playerLevel}> del jugador '${playerName}' no está definido en los parámetros de medición para el equipo <${playerTeam}>`);

    if (!teamsTotals[playerTeam]) { // Si no esta definido el equipo en el objeto de acumulados totales, se establece el objeto con sus propiedades
      teamsTotals[playerTeam] = {
        totalPlayerGoals: 0,
        totalGoalsLevels: 0,
        get getGoalsPercentage() { // retorna el porcentaje de goles de jugadores del equipo por nivel
          return /*customRound(*/this.totalPlayerGoals / this.totalGoalsLevels/*, 4)*/;
        },
        get getGoalsPercentageForced() { // retorna el porcentaje de goles de jugadores del equipo por nivel sin superar el 100%
          const percentage = this.getGoalsPercentage;
          if (percentage > 1) return 1;
          return percentage;
        }
      };
    }

    // Acumular valores totales por equipo
    teamsTotals[playerTeam].totalPlayerGoals = (teamsTotals[playerTeam].totalPlayerGoals || 0) + playerGoals; // total goles de los jugadores dentro del equipo
    teamsTotals[playerTeam].totalGoalsLevels = (teamsTotals[playerTeam].totalGoalsLevels || 0) + currentTeamLevel.goles; // total de meta de goles de los jugadores segun nivel del equipo

    //const goalsPercentage = playerGoals / currentTeamLevel.goles; // Porcentaje de goles del jugador segun nivel del equipo

    const playerData = {
      nombre: player.nombre,
      goles_minimos: currentTeamLevel.goles,
      goles: player.goles,
      sueldo: player.sueldo,
      bono: player.bono,
      sueldo_completo: player.sueldo_completo,
      //equipo: player.equipo,
      //goalsPercentage, // Se agrega nueva propiedad al jugador para usar en el calculo del bono posteriormente
      get getGoalsPercentage() { // retorna el porcentaje de goles de jugadores del equipo por nivel
        return /*customRound(*/this.goles / this.goles_minimos/*, 4)*/;
      },
      get getGoalsPercentageForced() { // retorna el porcentaje de goles de jugadores del equipo por nivel sin superar el 100%
        const percentage = this.getGoalsPercentage;
        if (percentage > 1) return 1;
        return percentage;
      }
    };

    if (validateObjectProperty(player, 'equipo')) playerData.equipo = player.equipo;

    return playerData; // Retorna los datos del jugador

  });

  //console.log(teamsTotals);
  /*Object.defineProperties(teamsTotals[], {
    'getPercentage': {
      get: function () {
        return this.totalPlayerGoals / this.totalGoalsLevels
      }
    }
  });*/

  // Ciclo para calcular la bonificación y el sueldo de cada jugador
  playersResult = playersResult.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const currentPlayer = Object.assign({}, player); // Para copiar el objeto y no la referencia (Solo si el objeto no posee subojetos)
    const playerSalary = currentPlayer.sueldo;
    const playerBonus = currentPlayer.bono;
    const playerTeam = currentPlayer.equipo || teamName;
    //
    //const bonusPercentage = (teamsTotals[playerTeam].getGoalsPercentage + currentPlayer.goalsPercentage) / 2; // Se calcula el procentaje del bono 50% equipo 50% personal

    // Se calcula el procentaje del bono 50% equipo 50% personal
    const bonusPercentage = forced
      ? (teamsTotals[playerTeam].getGoalsPercentageForced + currentPlayer.getGoalsPercentageForced) / 2
      : (teamsTotals[playerTeam].getGoalsPercentage + currentPlayer.getGoalsPercentage) / 2;

    const bonus = customRound(playerBonus * bonusPercentage, 2); // Calculo del bono del jugador

    // Se borran las propiedades despues de ser usadas en los calculos y que no se necesitan mostrar en la salida
    //delete currentPlayer.goalsPercentage;
    delete currentPlayer.getGoalsPercentage;
    delete currentPlayer.getGoalsPercentageForced;

    return {
      ...currentPlayer, // Retorna el objeto con los datos del jugador
      sueldo_completo: customRound(playerSalary + bonus, 2) // Se calcula el sueldo total del jugador
    }

  });

  return playersResult;

}; // end: const calculateSalary = (players, teamName) => {





// controlador para calcular el salario de los jugadores
controller.calculatePlayerSalary = (req, res, next) => {
  console.log(req.params.method);
  // Verificar si el calculo del % es forzado
  const forced = (req.params.method === "forced");

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const players = req.body.jugadores; // Se obtiene el objeto con la información del JSON de datos de entrada
  //
  //console.log(players);
  try {

    const message = validatePlayersData(players);

    if (message !== 'OK') genError(message);

    const playersResult = calculateSalaries(players, forced); // Calcular los sueldos de la lista de jugadores
    return res.json(playersResult); // Retorna la respuesta al frontend

  } catch (err) {
    //sendErrorResponse(req, res, 'error detectado js ' + err);
    next(err);
  }

} // end: controller.calculatePlayerSalary = (req, res, next) => {





// Controlador para calcular el salario de los jugadores por arreglo de equipos
controller.calculateTeamsSalary = (req, res, next) => {

  // Verificar si el calculo del % es forzado
  const forced = (req.params.method === "forced");

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const teams = req.body.equipos; // Se obtiene el objeto con la información del JSON de datos de entrada

  try {

    // validar
    const message = validateTeamsData(teams, true);
    if (message !== 'OK') genError(message);

    // Recorrer la lista de equipos recibida
    const teamsResult = teams.map((team, index) => {

      // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
      const teamName = team.nombre;
      const teamLevels = team.niveles;
      const teamPlayers = team.jugadores;

      //const playersResult = calculateSalaries(teamPlayers, teamName, teamLevels); // Calcular los sueldos de la lista de jugadores
      const playersResult = calculateSalaries(teamPlayers, forced, teamName, teamLevels); // Calcular los sueldos de la lista de jugadores

      return {
        //...team, // Los datos del equipo que no cambiaron
        nombre: teamName,
        jugadores: playersResult // La nueva lista de jugadores con los sueldos calculados
      };

    });

    res.json(teamsResult); // Retorna la respuesta al frontend

  } catch (err) {
    next(err);
  }


}; // end: controller.calculateTeamsSalary = (req, res, next) => {





module.exports = controller; // Exportar el controlador
