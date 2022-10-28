import { getActeurParIdFilm } from "./Dbsync";

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
