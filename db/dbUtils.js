const sqlite3 = require("sqlite3");
const sqliteSync = require("sqlite-sync");
const dbFileNameOfFilm = "./films.db";
const databaseFilm = new sqlite3.Database(dbFileNameOfFilm, (err) => {
  if (err) console.error();
  console.log(`Database ${dbFileNameOfFilm} as been initialised`);
});
const db = sqliteSync.connect("../test.db");

function initialiseDbFilm() {
  const creationTableFilm = `CREATE TABLE film (
    id_film INTEGER PRIMARY KEY,    titre_film VARCHAR(150),      annee INT,
   genre VARCHAR(50),                       synopsis VARCHAR(255),                note INT(2),
    url VARCHAR(255) )`;

  const creationTableActeur = `CREATE TABLE acteur (
    id_acteur INTEGER PRIMARY KEY,  prenom VARCHAR(100),          nom VARCHAR(100) )`;

  const creationTableCorespondanceFilmActeur = `CREATE TABLE acteur_dans_film (
      id_film INTEGER NOT NULL,                 id_acteur INTEGER NOT NULL,
      CONSTRAINT fk_acteurs_film FOREIGN KEY (id_film) REFERENCES film(id_film),
      CONSTRAINT fk_film_acteur FOREIGN KEY (id_acteur) REFERENCES acteur(id_acteur) )`;

  if (!databaseFilm.get(`select * from acteur`)) {
    databaseFilm.run(creationTableFilm);
    databaseFilm.run(creationTableActeur);
    databaseFilm.run(creationTableCorespondanceFilmActeur);
  }
}

function close() {
  databaseFilm.close();
}

// ==========================> FILMS <==========================
function getFilms(callback) {
  return databaseFilm.all(`SELECT * FROM film`, callback);
}

async function getFilmById(id) {
  const film = await db.get(`SELECT * FROM film WHERE id_film = ?`, [id]);
  return film;
}

function deleteFilmById(id, callback) {
  return databaseFilm.get(`DELETE FROM film WHERE id_film = ?`, [id], callback);
}

async function setFilm(film) {
  databaseFilm.run(
    `INSERT INTO film (titre_film, annee, genre, synopsis, note) VALUES (?, ?, ?, ?, ?)`,
    [film.titre_film, film.annee, film.genre, film.synopsis, film.note]
  );
}

function updateFilm(id, film, callback) {
  const filmToUpdate = databaseFilm.get(
    "SELECT * FROM film WHERE id=?",
    [id],
    callback
  );
}

// ==========================> ACTEURS <==========================
function getActeurs(callback) {
  return databaseFilm.all(`SELECT * FROM acteur`, callback);
}

async function setActeur(acteur) {
  databaseFilm.run(`INSERT INTO acteur (nom, prenom) VALUES (?, ?)`, [
    acteur.nom,
    acteur.prenom,
  ]);
}

module.exports = {
  databaseFilm,
  initialiseDbFilm,
  getFilms,
  getFilmById,
  deleteFilmById,
  setFilm,
  updateFilm,
  getActeurs,
  setActeur,
  close,
};
