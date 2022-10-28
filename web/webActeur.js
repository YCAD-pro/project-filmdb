const db = require("../db/Dbsync");

async function webActeurByQuery(req, res) {
  const { nom, prenom } = req.query;
  const result = await db.checkAndReturnIdActeur(nom, prenom);
  res.json(result);
}

async function webAddActeur(req, res) {
  const acteur = req.body;
  const acteurAdded = await db.setActeur(acteur);
  res.json(acteurAdded);
}

async function webActeurById(req, res) {
  const idActeurs = req.params.id;
  const acteur = await db.getActeurById(idActeurs);
  res.json(acteur);
}

async function webAllActeur(req, res) {
  const acteurs = await db.getActeurs();
  res.json(acteurs);
}
module.exports = {
  webActeurByQuery,
  webAddActeur,
  webActeurById,
  webAllActeur,
};
