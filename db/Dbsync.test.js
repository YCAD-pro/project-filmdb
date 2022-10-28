import {
  deleteFilmById,
  getFilmById,
  getFilmByTitre,
  getFilms,
  setFilm,
  updateFilm,
} from "./Dbsync";

test("Test des recuperations des films", async () => {
  const films = await getFilms();
  expect(films[0].id_film).toBeGreaterThan(0);
});

test("Test des recuperations des films", async () => {
  const films = await getFilmById(2);
  expect(films.id_film).toBe(2);
});

test("Test de getFilmByTitre", async () => {
  const film = await getFilmByTitre("matrix");
  expect(film.id_film).toBe(2);
});

test("Test de addFilm et deleteFilm", async () => {
  let filmTest = {
    titre_film: "test",
  };
  filmTest = await setFilm(filmTest);
  expect((await getFilmByTitre("test")).id_film).toBe(filmTest.id_film);
});

test("Test de l'update de Film", async () => {
  let filmToUpdate = await getFilmByTitre("test");
  filmToUpdate.annee = 2222;
  await updateFilm(filmToUpdate.id_film, filmToUpdate);
  expect((await getFilmByTitre("test")).annee).toBe(2222);
});

test("Test de delete Film", async () => {
  let filmTest = await getFilmByTitre("test");
  await deleteFilmById(filmTest.id_film);
  expect(await getFilmById(filmTest.id_film)).toBe(null);
});
