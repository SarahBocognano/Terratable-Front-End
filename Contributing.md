# Préparer les projets et dépots

-   le back tourne sur le port `3002`
-   https://github.com/Le-Bocal-Academy/Terratable-Back

-   le front en version `dev` sur le port `3000`
-   https://github.com/Le-Bocal-Academy/Terratable-Front

# Définir la politique de travail en équipe

## lexique

-   `#12` => ticket trello n°12
-   `1.2` => numéro de version

## Branches

### Branches réservées

voici les branches avec un comportement spécifiques :

(`xxx` => Non attribuer : variable à remplacer)

-   `master` => contiendras la prochaine version à déployer
-   `stagging/xxx` => contient la version `xxx` à déployer sur scaleingo
-   `feature/xxx` => contient le dev en cours de la feature décrite par le ticket Trello n°`xxx` (cf explication ci dessous)

### Branches stagging

-   les branches `staging/xxx` seront déployées automatiquement (et, on espere régulierement) sur scalingo
-   les versions (ici notées `xxx`) doivent être sous la forme de [Semantic Versioning](https://www.example.com)

    exemple semantic version is `1.2.3` (et non v1,v2 ect..ect..)

### Branches feature

-   Les branches sont à nommer par les numéros de ticket Trello

    exemple :
    https://trello.com/c/mOWxlWJS/3-ecriture-de-readme

    nom de branche : `feature/3-ecriture-de-readme`

### Politique de Merge

Intégration de nouvelle fonctionnalités (ticket trello)

-   l'objectif est de "rebase" les branches `feature/xxx` dans `master`

Déploiement d'une version "stable" (ou du moins mieux :P) de la banche principale `master`

-   l'objectif est de créer une nouvelle branches `staging/xxx` depuis `master`

# Identifier les difficultés techniques et réaliser des POC/tests

... todo

# @see

-   [Semantic Versioning](https://semver.org/)
-   [A quick reference to the Markdown syntax.](https://www.markdownguide.org/cheat-sheet)
