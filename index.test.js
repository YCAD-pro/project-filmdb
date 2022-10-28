import fetch from "node-fetch";

describe("Test integrations", function () {
  it("should ask /films", async function () {
    const result = await fetch("http:localhost:3000/films");
    const resultJson = await result.json();

    expect(resultJson.length > 0).toBe(true);
  });

  it("should find a film by (id=4) /filmByTitre/lala/", async () => {
    const rawFetch = await fetch("http://localhost:3000/filmByTitre/lala");
    const result = await rawFetch.json();

    expect(result.id_film).toBe(4);
  });

  it("should find my Acteur_ID by query type /acteurByQuery?nom=CADET&prenom=yannick", async () => {
    const rawFetch = await fetch(
      "http://localhost:3000/acteurByQuery?nom=CADET"
    );
    const result = await rawFetch.json();

    expect(result.id_acteur).toBe(9);
  });

  it("should find the movie id=4 where i played in ;)", async () => {
    const rawFetch = await fetch("http://localhost:3000/filmsByActeurId/9");
    const result = await rawFetch.json();

    expect(result.length > 0 && result[0].titre_film === "lala").toBe(true);
  });
});
