const customRound = require('../helpers/custom-round');
const { getCurrentTeamLevel } = require('../data/teams-levels');
//const genError = require('../helpers/error');
//const { sendErrorResponse } = require('../helpers/send-response');

const { validatePlayersData, validateTeamsData } = require('../helpers/json-validations');
//const { validateNumber, validateIngeter, validateObjectProperty } = require('../helpers/type-validations');

// Declaracion del controlador que sera exportado
const controller = {};







// Proceso para calcular los sueldos de la lista de jugadores
const calculateSalaries = (players, teamName) => {

  const teamsTotals = new Object(); // Objeto de niveles por equipos
  let playersResult; // Para el Array de jugadores mutable

  // Ciclo para calcular el puntaje global por equipo y el procentaje personal del jugador
  playersResult = players.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const playerGoals = player.goles;
    const playerLevel = player.nivel;
    const playerTeam = player.equipo || teamName; // Si el jugador no tiene el equipo se toma el parametro de entrada
    //

    const currentTeamLevel = getCurrentTeamLevel(playerTeam, playerLevel); // Se obtiene el nivel del jugador dentro de los niveles de su equipo

    if (!teamsTotals[playerTeam]) { // Si no esta definido el equipo en el objeto de acumulados totales, se establece el objeto con sus propiedades
      teamsTotals[playerTeam] = {
        totalPlayerGoals: 0,
        totalGoalsLevels: 0,
        get getGoalsPercentage() { // retorna el porcentaje de goles de jugadores del equipo por nivel
          return /*customRound(*/this.totalPlayerGoals / this.totalGoalsLevels/*, 4)*/;
        }
      };
    }

    // Acumular valores totales por equipo
    teamsTotals[playerTeam].totalPlayerGoals = (teamsTotals[playerTeam].totalPlayerGoals || 0) + playerGoals; // total goles de los jugadores dentro del equipo
    teamsTotals[playerTeam].totalGoalsLevels = (teamsTotals[playerTeam].totalGoalsLevels || 0) + currentTeamLevel.goals; // total de meta de goles de los jugadores segun nivel del equipo

    const goalsPercentage = playerGoals / currentTeamLevel.goals; // Porcentaje de goles del jugador segun nivel del equipo

    return { // Retorna el objeto con los datos del jugador
      ...player,
      goalsPercentage // Se agrega nueva propiedad al jugador para usar en el calculo del bono posteriormente
    };

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
    const bonusPercentage = (teamsTotals[playerTeam].getGoalsPercentage + currentPlayer.goalsPercentage) / 2; // Se calcula el procentaje del bono 50% equipo 50% personal

    const bonus = customRound(playerBonus * bonusPercentage, 2); // Calculo del bono del jugador

    delete currentPlayer.goalsPercentage; // Se borrar la propiedad despues de ser usada en el calculo y la cual no necesita mostrarse en la salida

    return {
      ...currentPlayer, // Retorna el objeto con los datos del jugador
      sueldo_completo: customRound(playerSalary + bonus, 2) // Se calcula el sueldo total del jugador
    }

  });

  return playersResult;

}; // end: const calculateSalary = (players, teamName) => {





// controlador para calcular el salario de los jugadores
controller.calculatePlayerSalary = (req, res, next) => {

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const players = req.body.jugadores; // Se obtiene el objeto con la información del JSON de datos de entrada
  //
  //console.log(players);
  try {

    if (validatePlayersData(players)) {

      const playersResult = calculateSalaries(players, null); // Calcular los sueldos de la lista de jugadores
      return res.json(playersResult); // Retorna la respuesta al frontend
    }
  } catch (err) {
    //sendErrorResponse(req, res, 'error detectado js ' + err);
    next(err);
  }

} // end: controller.calculatePlayerSalary = (req, res, next) => {





// Controlador para calcular el salario de los jugadores por arreglo de equipos
controller.calculateTeamsSalary = (req, res, next) => {

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const teams = req.body.equipos; // Se obtiene el objeto con la información del JSON de datos de entrada

  try {

    // validar
    if (validateTeamsData(teams)) {
      // Recorrer la lista de equipos recibida
      const teamsResult = teams.map((team, index) => {

        // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
        const players = team.jugadores;
        const teamName = team.nombre;

        const playersResult = calculateSalaries(players, teamName); // Calcular los sueldos de la lista de jugadores

        return {
          ...team, // Los datos del equipo que no cambiaron
          jugadores: playersResult // La nueva lista de jugadores con los sueldos calculados
        };

      });

      res.json(teamsResult); // Retorna la respuesta al frontend
    }

  } catch (err) {
    next(err);
  }


}; // end: controller.calculateTeamsSalary = (req, res, next) => {





module.exports = controller; // Exportar el controlador
