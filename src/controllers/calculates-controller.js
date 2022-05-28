const customRound = require('../helpers/custom-round');

const controller = {};


const levelList = [
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
];

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

const getLevel = ({ level }, playerLevel) => {
  return (level === playerLevel);
}

controller.calculateSalary = (req, res, next) => {

  // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
  const players = req.body.jugadores; // Se obtiene el objeto con la información del JSON
  //
  let totalTeamGoals = 0;
  let totalGoalsLevels = 0;

  // Calcular el puntaje global
  players.forEach((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const playerGoals = player.goles;
    const playerLevel = player.nivel;
    //

    const currentLevel = levelList.find(level => getLevel(level, playerLevel));
    totalTeamGoals += playerGoals;
    totalGoalsLevels += currentLevel.goals;

  });

  console.log(totalTeamGoals, totalGoalsLevels);
  const teamPercentage = totalTeamGoals / totalGoalsLevels; // porcentaje total del equipo
  console.log(teamPercentage);

  // Calcular puntaje personal
  const playersResult = players.map((player, index) => {

    // Debido a que el codigo fuente esta en ingles y el JSON está en espanol, se extraen los valores en variables para no mesclar el ingles con el espanol
    const playerGoals = player.goles;
    const playerLevel = player.nivel;
    const playerSalary = player.sueldo;
    const playerBonus = player.bono;
    //
    const currentLevel = levelList.find(level => getLevel(level, playerLevel));
    const playerPercentage = playerGoals / currentLevel.goals;
    const bonusPercentage = (teamPercentage + playerPercentage) / 2;

    const bonus = customRound(playerBonus * bonusPercentage, 2);

    return {
      ...player,
      sueldo_completo: customRound(playerSalary + bonus, 2)
    }

  });

  res.json(playersResult);

}


module.exports = controller;
