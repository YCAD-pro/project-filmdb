const sqliteSync = require("sqlite-sync");
const { logPlugin } = require("@babel/preset-env/lib/debug");
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
  let films = await db.run(`SELECT * FROM film`);
  for (let i = 0; i < films.length; i++) {
    let film = films[i];
    const listActeurs = await getActeurParIdFilm(film.id_film);
    film.acteurs = listActeurs;
  }
  return films;
}

async function getFilmById(idFilm) {
  let films = await db.run(
    `SELECT * FROM film WHERE id_film IS ?`,
    [idFilm],
    null
  );
  if (films.length > 0) {
    for (let i = 0; i < films.length; i++) {
      const film = films[i];
      film.acteurs = await getActeurParIdFilm(idFilm);
      return film;
    }
    return films;
  } else {
    return null;
  }
}

async function getListFilmByListId(listFilmId) {
  let listFilmRetour = [];
  if (listFilmId.length > 0) {
    listFilmId = listFilmId.map((obj) => obj.id_film);
  }
  for (let i = 0; i < listFilmId.length; i++) {
    const filmId = listFilmId[i];
    listFilmRetour.push(await getFilmById(filmId));
  }
  return listFilmRetour;
}

async function getFilmByTitre(titreFilm) {
  const film = await db.run(
    `SELECT * FROM film WHERE titre_film = ?`,
    [titreFilm.toLowerCase()],
    null
  );
  if (film[0]) {
    film[0].acteurs = await getActeurParIdFilm(film[0].id_film);
    return film[0];
  } else {
    return null;
  }
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
    await removeActeursInFilmById(idFilm);
    const acteurs = infosToUpdate.acteurs;
    await addActeurToFilm(filmToUpdate, acteurs);
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
  const acteurs = await db.run(`SELECT * FROM acteur`, [], null);
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

async function getActeurParIdFilm(idFilm) {
  const acteursDansFilm = await db.run(
    `SELECT DISTINCT nom, prenom FROM acteur_dans_film JOIN acteur a on a.id_acteur = acteur_dans_film.id_acteur WHERE id_film=?`,
    [idFilm],
    null
  );
  return acteursDansFilm;
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
async function checkAndReturnIdActeur(nom, prenom) {
  const retour = await db.run(
    `SELECT * FROM acteur WHERE nom=? OR prenom=?`,
    [nom, prenom],
    null
  );
  retour.forEach((obj) => {});
  if (retour.length > 1) {
    return retour;
  } else if (retour[0]) {
    return retour[0];
  }
  return null;
}
async function findFilmByIdActeur(idActeur) {
  const listFilms = await db.run(
    `SELECT DISTINCT adf.id_film from film JOIN acteur_dans_film adf on film.id_film = adf.id_film where id_acteur=?`,
    [idActeur],
    null
  );
  // Je recup des id films pour afficher un tableau des films
  let retour = await getListFilmByListId(listFilms);
  return retour;
}

// ==========================> FILM BY STATS <==========================

async function getFilmGenreStat() {
  const genre = await db.run(
    `SELECT genre, count(*) as Nb_Film FROM film GROUP BY genre`,
    [],
    null
  );
  return genre;
}

async function getFilmAnneeStat() {
  const genre = await db.run(
    `SELECT annee, count(*) as Nb_Film FROM film GROUP BY annee`,
    [],
    null
  );
  return genre;
}

async function getFilmNoteStat() {
  const genre = await db.run(
    `SELECT note, count(*) as Nb_Film FROM film GROUP BY note`,
    [],
    null
  );
  return genre;
}

// ==========================> EXPORTS <==========================
module.exports = {
  getFilms,
  getFilmById,
  getFilmByTitre,
  getListFilmByListId,
  setFilm,
  updateFilm,
  deleteFilmById,
  getActeurs,
  getActeurById,
  setActeur,
  checkAndReturnIdActeur,
  findFilmByIdActeur,
  getActeurParIdFilm,
  getFilmGenreStat,
  getFilmAnneeStat,
  getFilmNoteStat,
  close,
};
