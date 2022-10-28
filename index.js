import express, { raw } from "express";
import { webStatFilm } from "./web/webStat";
import {
  webActeurById,
  webActeurByQuery,
  webAddActeur,
  webAllActeur,
} from "./web/webActeur";
import {
  webExemple,
  webAllFilms,
  webFilmById,
  webFilmByTitre,
  webFilmByCriteres,
  webAddFilm,
  webDeleteFilm,
  webUpdateFilm,
  webFilmByActeurId,
} from "./web/webFilm";
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
app.get("/exempleDeFilm", webExemple);

app.get("/films", webAllFilms);

app.get("/film/:id", webFilmById);

app.get("/filmByTitre/:name", webFilmByTitre);

app.get("/films/filtre", webFilmByCriteres);

app.post("/film", webAddFilm);

app.delete("/film/:id", webDeleteFilm);

app.put("/film/:id", webUpdateFilm);

app.get("/statsFilms/:stats", webStatFilm);

app.get("/filmsByActeurId/:acteur", webFilmByActeurId);

app.get("/acteurs", webAllActeur);

app.get("/acteur/:id", webActeurById);

app.post("/acteur", webAddActeur);

app.get("/acteurByQuery", webActeurByQuery);
