const customRound = require('../helpers/round');

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

const getLevel = ({ level }, player) => {
  return (level === player.nivel);
}

controller.calculateSalary = (req, res, next) => {
  const players = req.body.jugadores;
  let totalGoals = 0;
  let globalGoal = 0;
  const personalBonus = players.map((player, index) => {
    const currentLevel = levelList.find(level => getLevel(level, player));
    console.log(player.nombre, currentLevel);
    //const correctLevel = player.nivel !== currentLevel.level ? currentLevel.level : player.nivel;
    //const bonus = Number(Math.round((player.bono * (player.goles / currentLevel.goals)) + 'e2') + 'e-2');
    const bonus = customRound(player.bono * (player.goles / currentLevel.goals), 2);
    //const bonus = Number.parseFloat((player.bono * (player.goles / currentLevel.goals)).toFixed(2));
    totalGoals += player.goles;
    globalGoal += currentLevel.goals;
    return {
      ...player,
      sueldo_completo: bonus
    }
  });
  console.log(totalGoals, globalGoal);
  res.json(personalBonus);
}


module.exports = controller;
