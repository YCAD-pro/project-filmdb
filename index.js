import express, { raw } from "express";
import {
  findFilmByIdActeur,
  getFilmAnneeStat,
  getFilmGenreStat,
  getFilmNoteStat,
} from "./db/Dbsync";
const app = express();
app.use(express.static("public"));
app.use(express.json());
const port = 3000;
const db = require("./db/Dbsync");

app
  .listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
  })
  .on("close", (err) => {
    if (err) {
      console.log("server stopped");
    }
    db.close();
    console.log("BYE");
  });

// ==========================> Routes Film <==========================
app.get("/exempleDeFilm", (req, res) => {
  const filmDefault = {
    titre: "",
    annee: 2000,
    genre: "",
    synopsis: "",
    acteurs: [],
    note: 20,
    url: "MyMAC/user/content/title.mp4",
  };
  res.json(filmDefault);
});

app.get("/films", async (req, res) => {
  const listFilm = await db.getFilms();
  res.json(listFilm);
});

app.get("/film/:id", async (req, res) => {
  const idFilm = req.params.id;
  const filmFounded = await db.getFilmById(idFilm);
  return res.json(filmFounded);
});

app.get("/filmByTitre/:name", async (req, res) => {
  const titreFilm = req.params.name;
  const filmFounded = await db.getFilmByTitre(titreFilm);
  return res.json(filmFounded);
});

app.get("/films/filtre", (req, res) => {
  // Les films correspondant a 1 critere (ex: nom, annee, genre, ...)
  const criteres = req.query;
  // TODO Faire une requete suivant criteres
  res.send(criteres);
});

app.post("/film", async (req, res) => {
  const filmToAdd = req.body;
  console.log("filmToAdd", filmToAdd);
  const filmAdded = await db.setFilm(filmToAdd);
  res.json(filmAdded);
});

app.delete("/film/:id", async (req, res) => {
  const idFilmToRemove = req.params.id;
  const removedFilm = await db.deleteFilmById(idFilmToRemove);
  res.json(removedFilm);
});

app.put("/film/:id", async (req, res) => {
  const idToUpdate = req.params.id;
  const partsToUpdate = req.body;
  const filmUpdated = await db.updateFilm(idToUpdate, partsToUpdate);
  res.json(filmUpdated);
});

// Statistique sur la collection de films
app.get("/statsFilms/:stats", async (req, res) => {
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
});

app.get("/filmsByActeurId/:acteur", async (req, res) => {
  const acteurId = req.params.acteur;
  const listFilmWithThisActeur = await findFilmByIdActeur(acteurId);
  res.json(listFilmWithThisActeur);
});

app.get("/acteurs", async (req, res) => {
  const acteurs = await db.getActeurs();
  res.json(acteurs);
});

app.get("/acteur/:id", async (req, res) => {
  const idActeurs = req.params.id;
  const acteur = await db.getActeurById(idActeurs);
  res.json(acteur);
});

app.post("/acteur", async (req, res) => {
  const acteur = req.body;
  const acteurAdded = await db.setActeur(acteur);
  res.json(acteurAdded);
});

app.get("/acteurByQuery", async (req, res) => {
  const { nom, prenom } = req.query;
  const result = await db.checkAndReturnIdActeur(nom, prenom);
  // console.log(`recherche de nom=${nom} et prenom=${prenom}`);
  res.json(result);
});
