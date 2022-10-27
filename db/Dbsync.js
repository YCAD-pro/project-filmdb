const sqliteSync = require("sqlite-sync");
const db = sqliteSync.connect("./filmSync.db");

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

  db.run(creationTableFilm);
  db.run(creationTableActeur);
  db.run(creationTableCorespondanceFilmActeur);
}

function close() {
  db.close();
}
// ==========================> FILMS <==========================
async function getFilms() {
  const films = await db.run(`SELECT * FROM film`);
  return films;
}

async function getFilmById(idFilm) {
  const film = await db.run(
    `SELECT * FROM film WHERE id_film = ?`,
    [idFilm],
    null
  );
  return film[0];
}

async function deleteFilmById(idFilm) {
  const filmToDelete = await db.run(
    `DELETE FROM film WHERE id_film = ?`,
    [idFilm],
    null
  );
  return filmToDelete;
}

async function setFilm(film) {
  const idFilmToAdd = await db.run(
    `INSERT INTO film (titre_film, annee, genre, synopsis, note, url) VALUES (?, ?, ?, ?, ?, ?)`,
    [film.titre_film, film.annee, film.genre, film.synopsis, film.note]
  );
  film.id_film = idFilmToAdd;
  return film;
}

async function updateFilm(idFilm, infosToUpdate) {
  let filmToUpdate = await getFilmById(idFilm);
  if (infosToUpdate.acteurs) {
    // TODO gerer les acteurs...
    await removeActeursInFilmById(idFilm);
    const acteurs = infosToUpdate.acteurs;
    await addActeurToFilm(filmToUpdate, acteurs);
    console.log("Il y a des acteurs...");
  }
  for (const key in infosToUpdate) {
    filmToUpdate[key] = infosToUpdate[key];
  }
  await db.run(
    "UPDATE film SET titre_film=?, annee=?, genre=?, synopsis=?, note=?, url=? where id_film=?",
    [
      filmToUpdate.titre_film,
      filmToUpdate.annee,
      filmToUpdate.genre,
      filmToUpdate.synopsis,
      filmToUpdate.note,
      filmToUpdate.url,
      filmToUpdate.id_film,
    ]
  );
  return filmToUpdate;
}

// ==========================> ACTEURS <==========================

async function getActeurs() {
  const acteurs = await db.run(`SELECT * FROM acteur`);
  return acteurs;
}
// findActeurById
async function getActeurById(idActeur) {
  const acteur = db.run(
    `SELECT * FROM acteur where id_acteur=?`,
    [idActeur],
    null
  );
  return acteur[0];
}
// findActeurByName
// setActeur
async function setActeur(acteur) {
  const idActeur = db.run(
    `INSERT INTO acteur (prenom, nom) VALUES (?, ?)`,
    [acteur.prenom, acteur.nom],
    null
  );
  acteur.id_acteur = idActeur;
  return acteur;
}
// updateActeur
// deleteActeur

// ==========================> MULTI TABLE <==========================
async function addActeurToFilm(film, acteurs) {
  // TODO Reste le check des acteurs dans le film
  let nbActeurAdded = 0;
  for (let i = 0; i < acteurs.length; i++) {
    let acteur = acteurs[i];
    const id = await checkAndReturnIdActeur(acteur);
    if (id) {
      acteur.id_acteur = id;
    } else {
      acteur = await setActeur(acteur);
      nbActeurAdded++;
    }
    db.run(`INSERT INTO acteur_dans_film (id_film, id_acteur) VALUES (?, ?)`, [
      film.id_film,
      acteur.id_acteur,
    ]);
  }
  return nbActeurAdded;
}

async function removeActeursInFilmById(idFilm) {
  const removedActeursInFilm = await db.run(
    `DELETE FROM acteur_dans_film WHERE main.acteur_dans_film.id_film=?`,
    [idFilm],
    null
  );
  return removedActeursInFilm;
}

// Check if acteur exist
async function checkAndReturnIdActeur({ nom, prenom }) {
  const retour = await db.run(
    `SELECT id_acteur FROM acteur WHERE nom=? AND prenom=?`,
    [nom, prenom],
    null
  );
  console.log("CheckActeurId = ", retour);
  if (retour[0]) {
    return retour[0].id_acteur;
  }
  return null;
}

// ==========================> EXPORTS <==========================
module.exports = {
  getFilms,
  getFilmById,
  setFilm,
  updateFilm,
  deleteFilmById,
  getActeurs,
  getActeurById,
  setActeur,
  checkAndReturnIdActeur,
  removeActeursInFilmById,
  close,
};
