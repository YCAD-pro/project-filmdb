const db = require("../db/Dbsync");
const {
  getFilmGenreStat,
  getFilmAnneeStat,
  getFilmNoteStat,
  findFilmByIdActeur,
} = require("../db/Dbsync");

function webExemple(req, res) {
  const filmDefault = {
    titre: "",
    annee: 2000,
    genre: "",
    synopsis: "",
    acteurs: [],
    note: 20,
    url: "http://youtu.be",
  };
  res.json(filmDefault);
}

async function webAllFilms(req, res) {
  const listFilm = await db.getFilms();
  res.json(listFilm);
}

async function webFilmById(req, res) {
  const idFilm = req.params.id;
  const filmFounded = await db.getFilmById(idFilm);
  return res.json(filmFounded);
}

async function webFilmByTitre(req, res) {
  const titreFilm = req.params.name;
  const filmFounded = await db.getFilmByTitre(titreFilm);
  return res.json(filmFounded);
}

async function webFilmByCriteres(req, res) {
  // Les films correspondant a 1 critere (ex: nom, annee, genre, ...)
  const criteres = req.query;
  // TODO Faire une requete suivant criteres
  res.send(criteres);
}

async function webAddFilm(req, res) {
  const filmToAdd = req.body;
  console.log("filmToAdd", filmToAdd);
  const filmAdded = await db.setFilm(filmToAdd);
  res.json(filmAdded);
}

async function webDeleteFilm(req, res) {
  const idFilmToRemove = req.params.id;
  const removedFilm = await db.deleteFilmById(idFilmToRemove);
  res.json(removedFilm);
}

async function webUpdateFilm(req, res) {
  const idToUpdate = req.params.id;
  const partsToUpdate = req.body;
  const filmUpdated = await db.updateFilm(idToUpdate, partsToUpdate);
  res.json(filmUpdated);
}

async function webFilmByActeurId(req, res) {
  const acteurId = req.params.acteur;
  const listFilmWithThisActeur = await findFilmByIdActeur(acteurId);
  res.json(listFilmWithThisActeur);
}

module.exports = {
  webExemple,
  webAllFilms,
  webFilmById,
  webFilmByTitre,
  webFilmByCriteres,
  webAddFilm,
  webDeleteFilm,
  webUpdateFilm,
  webFilmByActeurId,
};
