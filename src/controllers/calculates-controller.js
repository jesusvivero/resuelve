const customRound = require('../helpers/custom-round');

const controller = {};


/*const levelList = [
  {
    level: 'A',
    goals: 5
  },
  {
    level: 'B',
    goals: 10
  },
  {
    level: 'C',
    goals: 15
  },
  {
    level: 'Cuauh',
    goals: 20
  },
];*/

//const teamsLevels = require('../data/teams-levels.json');

//const loadTeamsLevels = () => {
const jsonData = require('../data/teams-levels.json');
//console.log(jsonData);
const teamsLevels = jsonData.teams;
/*const teamsLevels = jsonData.teams.map(data => {
  //let totalGoalsLevels = 0;
  //data.levels.forEach(level => {
  //  totalGoalsLevels += level.goals;
  //});
  return {
    ...data,
    totalGoalsLevels: data.levels.reduce((sum, next) => sum + (next['goals'] || 0), 0) // Sumar total goles
  };
});*/

/*Object.defineProperties(teamsLevels, {
  'totalGoalsLevels': {
    get: function () {
      return this.levels
    }
  }
});*/
//console.log(teamsLevels);
//};

/*const getLevel = ({ level, goals }, player) => {
  return (goals >== player.goles);
}

controller.calculateSalary = (req, res, next) => {
  const players = req.body.jugadores;
  let totalGoals = 0;
  let globalGoal = 0;
  const playersSalary = players.map((player, index) => {
    const currentLevel = levelList.find(level => getLevel(level, player)) || levelList[levelList.length - 1];
    console.log(player.nombre, currentLevel);
    const correctLevel = player.nivel !== currentLevel.level ? currentLevel.level : player.nivel;
    totalGoals += player.goles;
    globalGoal += currentLevel.goals;
    return {
      ...player,
      nivel: correctLevel,
      sueldo_completo: 1000
    }
  });
  //console.log(totalGoals, globalGoal);
  res.json(playersSalary);
}*/

/*const getCurrentLevel = ({ level }, playerLevel) => {
  return (level === playerLevel);
}*/
const getCurrentTeamLevel = (playerTeam, playerLevel) => {
  const team = teamsLevels.find(team => (team.name === playerTeam));
  const level = team.levels.find(({ level }) => (level === playerLevel));
  return level;
}

controller.calculateSalary = (req, res, next) => {
  //loadTeamsLevels();
  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const players = req.body.jugadores; // Se obtiene el objeto con la información del JSON
  //
  const teams = new Object();
  //let totalTeamGoals = 0;
  //let totalGoalsLevels = 0;

  // Calcular el puntaje global por equipo
  players.forEach((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const playerGoals = player.goles;
    const playerLevel = player.nivel;
    const playerTeam = player.equipo;
    //
    //const currentLevel = teamsLevels.find(team => getCurrentTeamLevel(team, playerTeam, playerLevel));
    const currentTeamLevel = getCurrentTeamLevel(playerTeam, playerLevel);
    //totalTeamGoals += playerGoals;
    //totalGoalsLevels += currentTeamLevel.goals;
    if (!teams[playerTeam]) { // Si no esta definido el equipo, se establece el objeto con sus propiedades
      teams[playerTeam] = {
        totalPlayerGoals: 0,
        totalGoalsLevels: 0,
        get getPercentage() {
          return /*customRound(*/this.totalPlayerGoals / this.totalGoalsLevels/*, 4)*/;
        }
      };
    }
    teams[playerTeam].totalPlayerGoals = (teams[playerTeam].totalPlayerGoals || 0) + playerGoals;
    teams[playerTeam].totalGoalsLevels = (teams[playerTeam].totalGoalsLevels || 0) + currentTeamLevel.goals;
  });

  //console.log(totalTeamGoals, totalGoalsLevels);
  console.log(teams);
  /*Object.defineProperties(teams[], {
    'getPercentage': {
      get: function () {
        return this.totalPlayerGoals / this.totalGoalsLevels
      }
    }
  });*/
  //console.log(teams['rojo'].getPercentage);
  //const teamPercentage = totalTeamGoals / totalGoalsLevels; // porcentaje total del equipo
  //console.log(teamPercentage);

  // Calcular puntaje personal
  const playersResult = players.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const playerGoals = player.goles;
    const playerLevel = player.nivel;
    const playerSalary = player.sueldo;
    const playerBonus = player.bono;
    const playerTeam = player.equipo;
    //
    //const currentLevel = levelList.find(level => getLevel(level, playerLevel));
    const currentTeamLevel = getCurrentTeamLevel(playerTeam, playerLevel);
    const playerPercentage = playerGoals / currentTeamLevel.goals;
    const bonusPercentage = (teams[playerTeam].getPercentage + playerPercentage) / 2;

    const bonus = customRound(playerBonus * bonusPercentage, 2);

    return {
      ...player,
      sueldo_completo: customRound(playerSalary + bonus, 2)
    }

  });

  res.json(playersResult);
  //res.json(teams);

}


module.exports = controller;
