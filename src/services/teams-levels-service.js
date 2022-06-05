
// Retorna la informacion de nivel segun equipo y el nivel dado al jugador
const getCurrentTeamLevel = (teamLevels, playerTeam, playerLevel) => {

  //console.log(levels);
  if (!teamLevels) return;

  const team = teamLevels.find(team => (team.nombre.toLowerCase() === playerTeam.toLowerCase()));
  if (!team) return;

  const level = team.niveles.find(({ nivel }) => (nivel === playerLevel));
  return level;

};



module.exports = {
  getCurrentTeamLevel
};
