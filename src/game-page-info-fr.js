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
    "animal-orb-fortress": {
      title: "Forteresse des Orbes Animales",
      difficulty: "Difficile",
      time: "5 à 8 minutes par parcours",
      gameplay: "Roguelite de défense par ricochets",
      genre: ["Ricochets", "Stratégie d'action", "Roguelite", "Animaux"],
      skills: ["Logic", "Problem Solving", "Focus"],
      guideKicker: "Guide de jeu original WeightPlay",
      guideTitleSuffix: "Guide de jeu",
      noteTitle: "Informations sur le joueur et la sauvegarde",
      hideScoreBands: true,
      intro: "Forteresse des Orbes Animales est une campagne de défense par ricochets composée de 30 parcours. Il faut lire l'arène avant de lancer un orbe spirituel. Chaque parcours comporte trois vagues continues. Le joueur fait glisser depuis le gardien lion pour prévisualiser une trajectoire sur les murs, libère une salve et protège le noyau de cristal pendant que les bêtes d'ombre avancent. Six régions de cinq parcours ajoutent armures, ancres protectrices, ennemis en phase, scindaires, pylônes miroirs mobiles, assaillants signalés et six boss régionaux aux mécaniques différentes. Entre les vagues, une bénédiction modifie l'assaut en cours ; entre les parcours, les Pierres Stellaires améliorent quatre salles permanentes.",
      story: [
        "La Forteresse de Cristal fut construite au croisement de six routes gardiennes : la Forêt de Cristal, les Ateliers d'Épines, les Ruines Lunaires, la Volte aux Miroirs, le Bastion de la Tempête et le Cœur de l'Éclipse. Quand le noyau a commencé à émettre une impulsion instable, les animaux d'ombre ont suivi ces routes vers l'intérieur. Le gardien lion ne peut laisser le noyau sans défense ; chaque combat part donc de la chambre de lancement et redirige les orbes spirituels sur les murs et les miroirs.",
        "Libérer un parcours stabilise sa route pour les équipes de réparation. Le Golem des Racines garde la porte de la forêt, le Colosse des Ronces occupe la forge épineuse, la Matriarche des Feux Follets Lunaires traverse la route lunaire, le Régent de la Carapace Prismatique contrôle la Volte aux Miroirs, le Gardien Corne de Tempête marque les couloirs de l'orage et l'Empereur du Noyau du Vide scelle la chambre finale en trois phases. Terminer le parcours 30 reconnecte les six routes et empêche l'impulsion corrompue d'attirer de nouveaux ennemis."
      ],
      systems: [
        "Visée et ricochets : faites glisser depuis le lanceur pour voir la trajectoire initiale, puis relâchez. L'orbe principal et un orbe écho plus faible voyagent selon des angles liés. Les rebonds peuvent traverser plusieurs couloirs ou atteindre une cible cachée. Orbe Scindé ajoute un troisième projectile ; Éclat Perforant réduit le délai avant qu'un orbe puisse toucher de nouveau la même cible.",
        "Parcours en trois vagues : les vagues 1 et 2 présentent la règle ennemie du parcours. La vague 3 utilise une formation d'élite conçue, sauf aux parcours 5, 10, 15, 20, 25 et 30, qui se terminent par un boss régional. Après une vague, le combat s'arrête pour choisir une bénédiction, puis reprend avec les PV restants du noyau et les améliorations actuelles.",
        "Ennemis spéciaux : les bêtes blindées absorbent un nombre fixe de coups avant de perdre des PV. Les ancres épineuses immobiles protègent périodiquement les alliés proches. Les feux follets lunaires deviennent intangibles jusqu'à leur retour. Les scindaires de cristal créent deux fragments plus rapides à leur défaite. Les assaillants marquent un couloir, chargent, puis laissent une fenêtre de récupération.",
        "Pylônes miroirs : les parcours avancés placent un ou deux pylônes hexagonaux solides dans l'arène. Les orbes y ricochent réellement, créant des trajectoires absentes des premières régions. Certains pylônes se déplacent horizontalement ; un angle auparavant sûr peut donc cesser de fonctionner pendant la même vague.",
        "Règles des boss : le Golem des Racines reconstruit une garde brisable ; le Colosse des Ronces invoque ancres et renforts blindés ; la Matriarche alterne périodes visibles et intangibles ; le Régent de la Carapace Prismatique ne subit des dégâts que lorsque le segment doré est ouvert ; le Gardien Corne de Tempête devient vulnérable après sa charge ; l'Empereur du Noyau du Vide change deux fois de phase, invoque une escorte, reconstruit sa protection et active deux pylônes.",
        "Croissance de l'assaut et croissance permanente : chaque vague propose Orbe Majeur, Orbe Scindé, Éclat Perforant, Recharge Rapide, Bouclier du Noyau ou Aimant Éclaireur. Les Pierres Stellaires obtenues améliorent les dégâts de la Forge des Orbes, les PV initiaux du Bouclier du Noyau, les frappes du Refuge des Compagnons et les récompenses de la Tour des Éclaireurs. Renouveler les bénédictions pour trois Diamants est facultatif, demande deux confirmations et n'est jamais nécessaire pour débloquer les parcours."
      ],
      how: [
        "Choisissez un parcours débloqué sur la carte horizontale. Lisez son nom, sa règle et son avertissement avant d'entrer.",
        "Faites glisser depuis le gardien lion vers l'angle souhaité. Utilisez l'aperçu pour choisir un tir direct, un ricochet mural, une traversée de l'arène ou une réflexion sur un pylône.",
        "Relâchez pour lancer la salve. Observez les anneaux d'armure, contours de phase, marques de charge, protections des ancres et signaux des boss.",
        "Après les vagues 1 et 2, choisissez une bénédiction. Un renouvellement coûte trois Diamants et exige une seconde confirmation.",
        "Gardez les PV du noyau au-dessus de zéro jusqu'à la fin de la vague 3. La victoire enregistre le parcours suivant et les Pierres Stellaires ; l'échec conserve les Pierres gagnées et le meilleur parcours débloqué.",
        "Revenez à la carte pour améliorer les salles, rejouer un parcours terminé ou continuer vers le parcours suivant depuis le résultat."
      ],
      strategyTips: [
        "Ne visez pas toujours l'ennemi le plus proche. Ancres, scindaires et feux follets en retrait peuvent créer davantage de pression ; utilisez un ricochet pour atteindre la bonne priorité.",
        "Un contour de phase indique que les dégâts sont bloqués. Préparez l'angle suivant et tirez quand l'ennemi redevient solide.",
        "Les pylônes mobiles sont des surfaces utiles. Visez légèrement devant leur déplacement pour atteindre un couloir inaccessible avec les seuls murs.",
        "Contre les assaillants et le Gardien Corne de Tempête, lisez le couloir marqué et attendez la récupération après la charge.",
        "Bouclier du Noyau et Recharge Rapide stabilisent un parcours sous pression ; Orbe Majeur et Éclat Perforant raccourcissent les phases dangereuses. Aimant Éclaireur aide la progression à long terme, mais n'arrête pas une brèche immédiate.",
        "Conservez le renouvellement facultatif pour une série de bénédictions vraiment inadaptée à la règle du parcours. Tous les parcours et les six boss restent accessibles sans dépenser de Diamants."
      ],
      progression: [
        "Les parcours 1 à 5 enseignent le tir direct, les ricochets sur un mur, les couloirs séparés et l'ordre des cibles. Couronne des Racines est le premier contrôle : le Golem reconstruit sa garde après une fenêtre vulnérable, il faut donc briser la protection puis profiter de l'ouverture.",
        "Les parcours 6 à 10 introduisent l'armure à plusieurs coups et les ancres immobiles. Les parcours 11 à 15 ajoutent le rythme des phases puis la première porte réfléchissante mobile. Le Colosse des Ronces invoque des protections, tandis que la Matriarche alterne invulnérabilité et récupération.",
        "Les parcours 16 à 20 ajoutent des pylônes physiques et des scindaires qui créent des fragments plus rapides. Les parcours 21 à 25 signalent les charges et ajoutent le rythme de la tempête. Le Régent fait tourner sa fenêtre vulnérable ; le Gardien Corne de Tempête doit terminer sa ruée avant de pouvoir être blessé.",
        "Les parcours 26 à 30 combinent armures, ancres, phases, scindaires, assaillants et pylônes mobiles. Le parcours 29 emploie tout le répertoire des ennemis ordinaires. Le parcours 30 ajoute deux changements de phase de l'Empereur, quatre invocations de soutien, des boucliers reconstruits et deux pylônes actifs."
      ],
      designNote: "Trois vagues courtes font de chaque parcours un problème de visée précis plutôt qu'une longue épreuve d'endurance. Les pauses conservent les dégâts du noyau et la configuration actuelle, tout en offrant une décision compacte. Les premières régions enseignent une géométrie prévisible avec les murs ; les pylônes suivants créent de nouvelles surfaces. Anneaux, boucliers, lignes de couloir et illustrations distinctes communiquent les contremesures. Le glissement est le contrôle principal sur téléphone ; au clavier, Gauche et Droite règlent la visée, tandis qu'Espace ou Entrée tire.",
      parent: "Le navigateur enregistre sur cet appareil le meilleur parcours débloqué, les Pierres Stellaires, le nombre de parties et les niveaux des quatre salles. Aucun compte n'est requis. Effacer les données du site peut supprimer cette progression. Les renouvellements avec Diamants sont facultatifs et ne sont pas nécessaires pour les 30 parcours. Les scores et bilans décrivent uniquement la partie et ne constituent pas une évaluation formelle.",
      faq: [
        ["Quel est l'objectif d'un parcours ?", "Protéger le noyau pendant trois vagues. Terminer la vague 3 enregistre le parcours, accorde des Pierres Stellaires et débloque le suivant."],
        ["Chaque parcours utilise-t-il le même boss ?", "Non. Chaque cinquième parcours est un contrôle avec un boss régional différent. Les autres se terminent par des formations d'élite conçues."],
        ["Pourquoi mon orbe a-t-il traversé un ennemi lunaire ?", "Un contour en pointillés indique une phase temporairement intangible. Attendez son retour à l'état solide."],
        ["À quoi servent les pylônes miroirs ?", "Ce sont de véritables surfaces réfléchissantes dans l'arène. Les pylônes avancés se déplacent et modifient les trajectoires disponibles."],
        ["Faut-il des Diamants pour terminer la campagne ?", "Non. Ils servent uniquement à renouveler une fois les trois bénédictions d'une vague après confirmation."],
        ["Que se passe-t-il après un échec ?", "L'assaut se termine, mais les Pierres Stellaires gagnées et le meilleur parcours débloqué sont conservés."],
        ["Quelle progression est enregistrée ?", "Le meilleur parcours, les Pierres Stellaires, le nombre de parties et les niveaux de la Forge des Orbes, du Bouclier du Noyau, du Refuge des Compagnons et de la Tour des Éclaireurs sont enregistrés dans ce navigateur."]
      ],
    },
  };

  games["spider-solitaire"] = {
    title: "Solitaire Spider",
    age: "9+",
    difficulty: "Facile à difficile",
    time: "5 à 20 minutes",
    skills: ["Planification", "Reconnaissance des formes", "Concentration"],
    intro: "Solitaire Spider utilise deux jeux de cartes dans dix colonnes. Construisez des suites décroissantes, séparez les couleurs mélangées quand c'est possible et complétez huit suites de même couleur du Roi à l'As pour vider la table.",
    story: [
      "Solitaire Spider conserve la sensation familière du moteur de cartes de Klondike, mais change l'espace de décision : chaque colonne compte, une nouvelle ligne du talon touche les dix colonnes et une colonne vide est puissante, tout en bloquant temporairement la distribution.",
      "Une couleur enseigne le rythme, deux couleurs ajoutent la séparation des couleurs et quatre couleurs demandent une planification à long terme sans changer les commandes principales."
    ],
    systems: [
      "Les cartes se placent par rang décroissant. Une carte face visible peut être posée sur le rang immédiatement supérieur ; un groupe ne se déplace ensemble que s'il est visible, décroissant et de la même couleur.",
      "Complétez une suite Roi-As de même couleur : elle est récupérée avec une animation lisible. Huit suites récupérées remportent la partie.",
      "Le talon distribue une carte face visible dans chacune des dix colonnes non vides. Annuler restaure la table, l'état visible, le talon, les distributions, le score et les suites complétées.",
      "Indice met en évidence un mouvement légal utile en privilégiant les cartes cachées révélées, les suites de même couleur, les suites terminées et les colonnes vides créées."
    ],
    how: [
      "Choisissez 1 couleur, 2 couleurs ou 4 couleurs sur l'écran principal.",
      "Faites glisser une carte visible ou une suite valide de même couleur sur le rang immédiatement supérieur.",
      "Utilisez les colonnes vides pour réorganiser n'importe quelle carte ou suite valide.",
      "Révélez les cartes cachées, puis distribuez une nouvelle ligne seulement lorsque chaque colonne contient une carte.",
      "Complétez les huit suites de même couleur du Roi à l'As pour gagner."
    ],
    strategyTips: [
      "Révélez une carte cachée avant un mouvement qui ne change que la surface.",
      "Gardez les suites de même couleur ensemble ; les suites mélangées servent d'appui, mais ne peuvent pas se déplacer en groupe.",
      "Considérez une colonne vide comme une réserve : utilisez-la pour séparer les couleurs ou révéler une carte cachée.",
      "Ne distribuez pas automatiquement lorsqu'une révélation ou une fusion de même couleur reste possible.",
      "À quatre couleurs, protégez la suite la plus propre et utilisez Annuler pour comparer les destinations."
    ],
    progression: [
      "1 couleur enseigne le rythme, 2 couleurs ajoutent les conflits de couleurs et 4 couleurs est le mode classique le plus exigeant.",
      "Chaque difficulté conserve séparément les parties jouées, les victoires, le taux de victoire, le meilleur temps et le plus petit nombre de coups.",
      "Recommencer utilise la même graine sans changer la donne ; Nouvelle partie crée un nouveau mélange."
    ],
    designNote: "Spider partage avec Klondike le moteur de cartes, le canevas de bataille adaptatif, la couche de glisser-déposer, l'entrée tactile, le rythme des animations, la préférence sonore, les instantanés d'annulation et le langage visuel des cartes.",
    parent: "Solitaire Spider est un jeu de stratégie avec des cartes destiné au grand public, recommandé dès 9 ans et adapté au jeu en famille. Aucun compte n'est nécessaire ; les statistiques par difficulté et les préférences restent dans ce navigateur.",
    related: ["klondike-solitaire"],
    relatedIds: ["klondike-solitaire"],
    faq: [
      ["Combien de cartes sont utilisées ?", "Deux jeux standard sont utilisés : 104 cartes, dont 54 dans la table initiale et 50 dans le talon."],
      ["Combien y a-t-il de colonnes ?", "Il y a dix colonnes ; les quatre premières commencent avec six cartes et les six autres avec cinq."],
      ["Peut-on empiler des couleurs différentes ?", "Oui. Les rangs peuvent descendre entre les couleurs, mais seule une suite décroissante de même couleur peut être déplacée en groupe ou récupérée."],
      ["Pourquoi le talon est-il bloqué ?", "Le Spider classique exige que les dix colonnes contiennent au moins une carte avant de distribuer une nouvelle ligne."],
      ["Combien de suites faut-il pour gagner ?", "Il faut récupérer huit suites de même couleur du Roi à l'As."],
      ["Qu'est-ce qui change selon la difficulté ?", "1 couleur, 2 couleurs et 4 couleurs changent le mélange des couleurs, mais gardent les mêmes règles à dix colonnes."],
      ["Puis-je recommencer la même donne ?", "Oui. Recommencer utilise la même graine ; Nouvelle partie mélange une nouvelle donne."],
      ["Annuler restaure-t-il une suite terminée ?", "Oui. Annuler restaure toute la table précédente et le nombre de groupes récupérés."]
    ]
  };

  const gameplayProfiles = {
    "bubble-bakery": {
      gameplay: "Puzzle de groupes de bulles",
      genre: ["Puzzle", "Logique", "Animaux"],
    },
    "animal-orb-fortress": {
      gameplay: "Roguelite de défense par ricochets",
      genre: ["Ricochets", "Stratégie d'action", "Roguelite", "Animaux"],
    },
  };

  window.WeightPlayGameInfoLocales = window.WeightPlayGameInfoLocales || {};
  window.WeightPlayGameInfoLocales.fr = { labels, skillLabels, games, gameplayProfiles };
})();
