const {
  getFilmGenreStat,
  getFilmAnneeStat,
  getFilmNoteStat,
} = require("../db/Dbsync");

async function webStatFilm(req, res) {
  const askedStats = req.params.stats;
  if (askedStats === "genre") {
    return res.json(await getFilmGenreStat());
  } else if (askedStats === "annee") {
    return res.json(await getFilmAnneeStat());
  } else if (askedStats === "note") {
    return res.json(await getFilmNoteStat());
  } else {
    return res.send("FILTRE NON VALIDE");
  }
}

module.exports = {
  webStatFilm,
};
