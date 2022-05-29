const customRound = require('../helpers/custom-round');
const { getCurrentTeamLevel } = require('../data/teams-levels');

// Declaracion del controlador que sera exportado
const controller = {};


// controlador para calcular el salario de los jugadores
controller.calculatePlayerSalary = (req, res, next) => {

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const players = req.body.jugadores; // Se obtiene el objeto con la información del JSON de datos de entrada
  //
  const teams = new Object(); // Objeto de niveles por equipos
  let playersResult; // Array de jugadores mutable

  // Ciclo para calcular el puntaje global por equipo y el procentaje personal del jugador
  playersResult = players.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const playerGoals = player.goles;
    const playerLevel = player.nivel;
    const playerTeam = player.equipo;
    //
    const currentTeamLevel = getCurrentTeamLevel(playerTeam, playerLevel); // Se obtiene el nivel del jugador dentro de los niveles de su equipo

    if (!teams[playerTeam]) { // Si no esta definido el equipo, se establece el objeto con sus propiedades
      teams[playerTeam] = {
        totalPlayerGoals: 0,
        totalGoalsLevels: 0,
        get getGoalsPercentage() { // retorna el porcentaje de goles de jugadores del equipo por nivel
          return /*customRound(*/this.totalPlayerGoals / this.totalGoalsLevels/*, 4)*/;
        }
      };
    }

    // Acumular valores
    teams[playerTeam].totalPlayerGoals = (teams[playerTeam].totalPlayerGoals || 0) + playerGoals; // total goles de los jugadores dentro del equipo
    teams[playerTeam].totalGoalsLevels = (teams[playerTeam].totalGoalsLevels || 0) + currentTeamLevel.goals; // total de meta de goles de los jugadores segun nivel del equipo

    const goalsPercentage = playerGoals / currentTeamLevel.goals; // Porcentaje de goles del jugador segun nivel del equipo

    return { // Retorna el objeto con los datos del jugador
      ...player,
      goalsPercentage // Se agrega nueva propiedad al jugador para usar en el calculo del bono posteriormente
    };

  });

  //console.log(teams);
  /*Object.defineProperties(teams[], {
    'getPercentage': {
      get: function () {
        return this.totalPlayerGoals / this.totalGoalsLevels
      }
    }
  });*/

  // Ciclo para calcular la bonificación y el sueldo de cada jugador
  playersResult = playersResult.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const currentPlayer = player;
    const playerSalary = currentPlayer.sueldo;
    const playerBonus = currentPlayer.bono;
    const playerTeam = currentPlayer.equipo;
    //
    const bonusPercentage = (teams[playerTeam].getGoalsPercentage + currentPlayer.goalsPercentage) / 2; // Se calcula el procentaje del bono 50% equipo 50% personal

    const bonus = customRound(playerBonus * bonusPercentage, 2); // Calculo del bono del jugador

    delete currentPlayer.goalsPercentage; // Se borrar la propiedad despues de ser usada en el calculo y la cual no necesita mostrarse en la salida

    return {
      ...currentPlayer, // Retorna el objeto con los datos del jugador
      sueldo_completo: customRound(playerSalary + bonus, 2) // Se calcula el sueldo total del jugador
    }

  });

  res.json(playersResult); // Retorna la respuesta
  //res.json(teams);

} // end: controller.calculatePlayerSalary = (req, res, next) => {


// Controlador para calcular el salario de los jugadores por arreglo de equipos
controller.calculateTeamsSalary = (req, res, next) => {

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const teams = req.body.equipos; // Se obtiene el objeto con la información del JSON de datos de entrada
  //
  let teamsResult;

  teamsResult = teams.map((team, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const players = team.jugadores;
    let totalPlayerGoals = 0;
    let totalGoalsLevels = 0;

    const playersResult = players.map((player, index) => {
      const playerGoals = player.goles;
      const playerLevel = player.nivel;
      const playerTeam = team.nombre;
      //
      const currentTeamLevel = getCurrentTeamLevel(playerTeam, playerLevel); // Se obtiene el nivel del jugador dentro de los niveles de su equipo


      // Acumular valores
      totalPlayerGoals += playerGoals; // total goles de los jugadores dentro del equipo
      totalGoalsLevels += currentTeamLevel.goals; // total de meta de goles de los jugadores segun nivel del equipo

      const goalsPercentage = playerGoals / currentTeamLevel.goals; // Porcentaje de goles del jugador segun nivel del equipo

      return { // Retorna el objeto con los datos del jugador
        ...player,
        goalsPercentage // Se agrega nueva propiedad al jugador para usar en el calculo del bono posteriormente
      };
    });

    return {
      ...team,
      jugadores: playersResult,
      totalPlayerGoals,
      totalGoalsLevels,
      get getGoalsPercentage() { // retorna el porcentaje de goles de jugadores del equipo por nivel
        return /*customRound(*/this.totalPlayerGoals / this.totalGoalsLevels/*, 4)*/;
      }
    };

  });

  teamsResult = teamsResult.map((team, index) => {

    const currentTeam = team;
    const players = currentTeam.jugadores;
    // Ciclo para calcular la bonificación y el sueldo de cada jugador
    const playersResult = players.map((player, index) => {

      // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
      const currentPlayer = player;
      const playerSalary = currentPlayer.sueldo;
      const playerBonus = currentPlayer.bono;
      //
      const bonusPercentage = (currentTeam.getGoalsPercentage + currentPlayer.goalsPercentage) / 2; // Se calcula el procentaje del bono 50% equipo 50% personal

      const bonus = customRound(playerBonus * bonusPercentage, 2); // Calculo del bono del jugador

      delete currentPlayer.goalsPercentage; // Se borrar la propiedad despues de ser usada en el calculo y la cual no necesita mostrarse en la salida

      return {
        ...currentPlayer, // Retorna el objeto con los datos del jugador
        sueldo_completo: customRound(playerSalary + bonus, 2) // Se calcula el sueldo total del jugador
      }
    });

    delete currentTeam.totalPlayerGoals;
    delete currentTeam.totalGoalsLevels;
    delete currentTeam.getGoalsPercentage;

    return {
      ...currentTeam,
      jugadores: playersResult
    };

  });

  res.json(teamsResult);
}; // end: controller.calculateTeamsSalary = (req, res, next) => {

module.exports = controller;
