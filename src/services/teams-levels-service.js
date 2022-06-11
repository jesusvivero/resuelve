/*

- teams-levels-service.js -
Modulo de servicios para procesos de niveles de evaluacion de equipos y jugadores

*/

// Retorna la informacion de nivel segun equipo y el nivel dado al jugador
const getCurrentTeamLevel = (teamLevels, playerTeam, playerLevel) => {

  // Verificar que la lista de niveles tenga informacion
  if (!teamLevels) return;

  // Encontrar el equipo
  const team = teamLevels.find(team => (team.nombre.toLowerCase() === playerTeam.toLowerCase()));
  if (!team) return;

  // Encontrar el nivel dentro del equipo
  const level = team.niveles.find(({ nivel }) => (nivel === playerLevel));
  return level;

};



module.exports = {
  getCurrentTeamLevel
};
