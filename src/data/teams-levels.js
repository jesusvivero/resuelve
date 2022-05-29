const jsonData = require('../data/teams-levels.json'); // Cargar JSON con la configuracion de niveles por equipo
//console.log(jsonData);

const teamsList = jsonData.teams; // Se crea lista de configuracion de equipos

// Retorna la informacion de nivel segun equipo y el nivel dado al jugador
const getCurrentTeamLevel = (playerTeam, playerLevel) => {
  const team = teamsList.find(team => (team.name === playerTeam));
  const level = team.levels.find(({ level }) => (level === playerLevel));
  return level;
};

module.exports = {
  teamsList,
  getCurrentTeamLevel
};
