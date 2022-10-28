import {
  deleteFilmById,
  getActeurById,
  getActeurs,
  getFilmById,
  getFilmByTitre,
  getFilms,
  setActeur,
  setFilm,
  updateFilm,
} from "./Dbsync";

describe("Test unitaires de la BDD", function () {
  it("should get films", async () => {
    const films = await getFilms();
    expect(films[0].id_film).toBeGreaterThan(0);
  });

  it("should pick a film by his id", async () => {
    const films = await getFilmById(2);
    expect(films.id_film).toBe(2);
  });

  it("should pick a film by his title", async () => {
    const film = await getFilmByTitre("matrix");
    expect(film.id_film).toBe(2);
  });

  it("should add a film with title 'test'", async () => {
    let filmTest = {
      titre_film: "test",
    };
    filmTest = await setFilm(filmTest);
    expect((await getFilmByTitre("test")).id_film).toBe(filmTest.id_film);
  });

  it("should able to upgrade the film test and set annee to 2222", async () => {
    let filmToUpdate = await getFilmByTitre("test");
    filmToUpdate.annee = 2222;
    await updateFilm(filmToUpdate.id_film, filmToUpdate);
    expect((await getFilmByTitre("test")).annee).toBe(2222);
  });

  it("should be able to delete the film test", async () => {
    let filmTest = await getFilmByTitre("test");
    await deleteFilmById(filmTest.id_film);
    expect(await getFilmById(filmTest.id_film)).toBe(null);
  });

  it("should be able to add and return an Acteur", async () => {
    let testActeur = { nom: "TEST", prenom: "Acteur" };
    testActeur = setActeur(testActeur);
    expect(getActeurById(testActeur.id_acteur)).toEqual(testActeur);
  });
});
