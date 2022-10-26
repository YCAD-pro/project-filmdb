# Projet FilmDB

Votre objectif est de créer une API permettant de gérer la collection de films que vous avez sur votre ordinateur.
L'API permettra d'obtenir la liste des ses films, d'en ajouter, modifier et supprimer.
Elle permettra également d'effectuer une recherche selon les différentes propriétés d'un film, et d'obtenir le fichier vidéo associé à un film.

## Technologies

- Implémenter une API JSON
- Stockage dans une DB Relationelle. Recommandation : sqlite, pour plus de simplicité.

Déjà installés :

- Jest `npm test`
- Express `npm start`
- ESlint, Prettier
- Babel, Babel-node, pour utiliser une syntaxe moderne sans soucis. `npx babel-node fichier.js` pour exécuter un fichier particulier avec babel.

## Fonctionnalités essentielles

- Stocker un ensemble de films
  - Nom, Année, Miniature, emplacement du fichier vidéo, liste d'acteurs, synopsis, genre, réalisateur

API REST JSON :

- Endpoint permettant de lister tous les films
- Endpoint permettant de lister tous les films correspondant à un critère (nom, année, genre, acteur, réalisateur)
- Endpoint permettant de créer un film
- Endpoint permettant de supprimer un film
- Endpoint permettant de modifier un film
- Endpoint permettant d'obtenir des statistiques sur sa collection de films
  - Nombre total et nombre par genre
  - Réalisateur le plus et le moins populaire
  - Acteur le plus et le moins populaire
  - Genre le plus et le moins présent

## Fonctionnalités supplémentaires (idées, n'hésitez pas à implémenter les votres)

- Récupération automatique de métadonnées via l'API IMDB https://developer.imdb.com/
- Ebauche de frontend
- Endpoint permettant de télécharger le fichier vidéo associé à un film
- Endpoint permettant de télécharger la miniature associé à un film

## Barème et notation

- Le plus important est la qualité du code et la qualité des tests. Préférez implémenter moins de fonctionnalités mais mieux.

| Topic                   | Points     |
| ----------------------- | ---------- |
| Project features        | 8          |
| Unit tests              | 4          |
| E2E & Integration tests | 4          |
| Code quality : naming   | 1          |
| Code quality : general  | 3          |
| Git usage               | +2 (Bonus) |
