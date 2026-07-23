/* Authored French public-game guide resource. Loaded by the shared guide generator. */
(() => {
  const labels = {
    kicker: "Guide de jeu WeightPlay pour enfants",
    titleSuffix: "Jeu gratuit pour enfants",
    gameplay: "Type de jeu",
    genre: "Genre",
    recommendedAge: "Âge conseillé",
    difficulty: "Difficulté",
    estimatedTime: "Durée estimée",
    skills: "Compétences travaillées",
    worldAndMission: "Univers et mission",
    gameSystems: "Fonctionnement du jeu",
    progressionAndDifficulty: "Progression et difficulté",
    developerNote: "Note de conception",
    howToPlay: "Comment jouer",
    strategyTips: "Conseils",
    parentNote: "Pour les parents",
    faq: "Questions fréquentes",
    relatedGames: "Jeux associés",
    relatedIntro: "Pour continuer à exercer {skill}, essayez aussi :",
    guideLabel: "Informations sur le jeu {title}",
  };

  const skillLabels = {
    Logic: "Logique",
    "Problem Solving": "Résolution de problèmes",
    Focus: "Concentration",
  };

  const games = {
    "bubble-bakery": {
      title: "La Pâtisserie des Bulles Animales",
      age: "6+",
      difficulty: "Facile à intermédiaire",
      time: "3 à 5 minutes",
      gameplay: "Puzzle de groupes de bulles",
      genre: ["Puzzle", "Logique", "Animaux"],
      skills: ["Logic", "Problem Solving", "Focus"],
      guideKicker: "Guide de jeu WeightPlay pour enfants",
      guideTitleSuffix: "Guide de jeu",
      intro: "La Pâtisserie des Bulles Animales est un puzzle en 30 commandes, guidé par Panko, le chef pâtissier. Touchez des groupes reliés de bulles lapin, baleine, poussin, grenouille ou renard pour remplir les plateaux de recettes avant d’épuiser vos coups. Le plateau de 7 colonnes sur 10 rangées se réorganise après chaque groupe retiré. Plus tard, les commandes ajoutent une taille minimale, un ordre précis, plusieurs recettes, des bonus de grand groupe et des objectifs de maîtrise. Toutes les cinq commandes, un Défi de Panko réunit les règles apprises, sans combat ni limite de temps.",
      story: [
        "Dans la petite pâtisserie de Panko, chaque client animal commande avec des images. Les bulles représentent les ingrédients à réunir : lapins, baleines, poussins, grenouilles et renards. Le joueur aide Panko à préparer chaque plateau avec un nombre limité de coups.",
        "Les 30 commandes forment six leçons de cinq commandes. Les Défis de Panko des commandes 5, 10, 15, 20, 25 et 30 sont des vérifications amicales. La Grande Pâtisserie de Panko demande de servir trois recettes successives et de réussir un groupe de six bulles.",
      ],
      systems: [
        "Le plateau contient toujours 70 boutons-bulles répartis en sept colonnes et dix rangées. Des bulles identiques forment un groupe seulement si elles se touchent horizontalement ou verticalement ; les diagonales ne comptent pas.",
        "Tout groupe valide de deux bulles ou plus peut être retiré et coûte un coup. Seules les bulles demandées remplissent le plateau de recette, mais retirer un autre groupe peut préparer une meilleure combinaison.",
        "Après un retrait, les bulles restent dans leur case pendant l’animation, celles du dessus tombent, puis de nouvelles bulles arrivent par le haut. Le plateau revient toujours à 70 bulles avant le coup suivant.",
        "Certaines commandes exigent des groupes de trois ou quatre. D’autres mettent en évidence un animal à servir avant les suivants, enchaînent deux ou trois recettes, accordent un bonus aux grands groupes ou demandent au moins un groupe d’une taille précise.",
        "La commande 30 combine trois recettes, des groupes d’au moins quatre bulles, des cibles dans l’ordre, un bonus à partir de six bulles et un objectif de maîtrise de six bulles.",
        "Les commandes débloquées, les étoiles et les meilleurs résultats sont enregistrés uniquement dans ce navigateur. Aucun compte n’est nécessaire ; effacer les données du site peut supprimer cette progression locale.",
      ],
      how: [
        "Choisissez une commande débloquée sur la liste horizontale.",
        "Regardez les animaux demandés, les quantités et les symboles de règle.",
        "Touchez un groupe d’au moins deux bulles identiques reliées horizontalement ou verticalement.",
        "Surveillez les coups restants et préparez les groupes nécessaires aux prochaines cibles.",
        "Terminez chaque recette et l’éventuel objectif de grand groupe avant d’arriver à zéro coup.",
        "Dans le résultat, continuez vers la commande suivante, recommencez ou revenez à la liste des commandes.",
      ],
      strategyTips: [
        "Cherchez d’abord les groupes près du bas : leur retrait déplace davantage de bulles et peut créer de nouvelles connexions.",
        "Dans une commande ordonnée, gardez les groupes des animaux suivants jusqu’à ce que leur cible soit mise en évidence.",
        "Quand un minimum de trois ou quatre est demandé, réunissez les petites paires au lieu de dépenser un coup trop tôt.",
        "Un grand groupe peut remplir plus vite une commande, mais un objectif de maîtrise exige tout de même d’atteindre la taille indiquée au moins une fois.",
        "Entre plusieurs recettes, le plateau et les coups restants ne sont pas réinitialisés : conservez des groupes utiles pour le plateau suivant.",
      ],
      progression: [
        "Les commandes 1 à 5 présentent les groupes reliés, deux cibles, un premier objectif de taille et un bonus de quatre bulles.",
        "Les commandes 6 à 10 apprennent à construire de grands groupes de trois, quatre ou cinq bulles.",
        "Les commandes 11 à 15 introduisent les cibles à servir dans l’ordre, puis deux recettes successives.",
        "Les commandes 16 à 20 développent le service de deux et trois recettes sans réinitialiser le plateau.",
        "Les commandes 21 à 25 combinent ordre, taille minimale, bonus, recettes multiples et objectifs de grand groupe.",
        "Les commandes 26 à 30 sont des commandes de maîtrise. La dernière réunit toutes les règles importantes dans trois recettes.",
      ],
      designNote: "Le plateau de 7 × 10 remplit efficacement un téléphone en mode portrait tout en conservant des bulles rondes et assez d’espace pour planifier. Une seule action suffit — toucher un groupe — mais chaque choix modifie la gravité, les connexions futures et les coups restants. Les Défis de Panko créent des repères amicaux sans transformer ce puzzle de pâtisserie en combat.",
      parent: "La Pâtisserie des Bulles Animales peut faire travailler le regroupement visuel, le comptage, la planification, la concentration et la résolution de problèmes simples. Il n’y a ni chronomètre, ni publicité, ni compte obligatoire, ni classement. Les étoiles, scores et bilans sont des retours de jeu enregistrés localement ; ils ne constituent ni un test d’intelligence, ni un diagnostic, ni une évaluation scolaire.",
      faq: [
        ["Combien de commandes le jeu contient-il ?", "Il contient 30 commandes réparties en six leçons, avec un Défi de Panko toutes les cinq commandes."],
        ["Quelles bulles appartiennent au même groupe ?", "Les bulles identiques reliées horizontalement ou verticalement forment un groupe. Une diagonale seule ne les relie pas."],
        ["Pourquoi un groupe n’a-t-il pas rempli la commande ?", "La règle peut demander un groupe plus grand ou un animal précis mis en évidence dans une file ordonnée."],
        ["Que se passe-t-il entre deux recettes ?", "La recette change, mais le plateau et les coups restants continuent. Les groupes conservés peuvent donc servir ensuite."],
        ["Comment fonctionnent les bonus de grand groupe ?", "Dans les commandes marquées, atteindre la taille indiquée ajoute des bulles supplémentaires à la cible active."],
        ["Que se passe-t-il quand il ne reste plus de coups ?", "Si la commande n’est pas terminée, un résultat encourageant propose de réessayer. Les commandes déjà débloquées restent disponibles."],
        ["Le jeu demande-t-il un compte ou affiche-t-il des publicités ?", "Non. Ce jeu Kids est sans publicité et enregistre la progression uniquement dans le navigateur, sans compte."],
        ["Le bilan des compétences est-il une évaluation ?", "Non. Il résume seulement cette partie pour donner un retour ludique."],
      ],
      related: [
        {
          id: "color-lunchbox",
          title: "La Boîte-repas des Couleurs Animales",
          description: "Associez chaque aliment à la boîte de la même couleur dans 30 niveaux calmes fondés sur les images.",
          cover: "lunchbox-cover.webp",
        },
        {
          id: "animal-bubble-safari",
          title: "Le Safari des Bulles Animales",
          description: "Visez, faites rebondir et regroupez les bulles animales pour accomplir les objectifs de chaque safari.",
          cover: "animal-bubble-safari-cover.webp",
        },
        {
          id: "star-memory",
          title: "La Mémoire Étoilée des Animaux",
          description: "Mémorisez les cartes sous le ciel étoilé et retrouvez les paires d’animaux au fil de 30 étapes.",
          cover: "memory-cover.webp",
        },
      ],
    },
  };

  const gameplayProfiles = {
    "bubble-bakery": {
      gameplay: "Puzzle de groupes de bulles",
      genre: ["Puzzle", "Logique", "Animaux"],
    },
  };

  window.WeightPlayGameInfoLocales = window.WeightPlayGameInfoLocales || {};
  window.WeightPlayGameInfoLocales.fr = { labels, skillLabels, games, gameplayProfiles };
})();
