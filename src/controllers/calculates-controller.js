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


const getLevel = ({ level, goals }, player) => {
  return (goals >= player.goles);
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
}


module.exports = controller;
