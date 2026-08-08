/* Authored German public-game guide resource. Loaded by the shared guide generator. */
(() => {
  const labels = {
    kicker: "WeightPlay-Leitfaden für Originalspiele",
    titleSuffix: "Kostenloses Browserspiel",
    gameplay: "Spielart",
    genre: "Genre",
    recommendedAge: "Empfohlenes Alter",
    difficulty: "Schwierigkeit",
    estimatedTime: "Spielzeit",
    skills: "Trainierte Fähigkeiten",
    worldAndMission: "Welt und Auftrag",
    gameSystems: "So funktioniert das Spiel",
    progressionAndDifficulty: "Fortschritt und Schwierigkeit",
    developerNote: "Hinweis zur Gestaltung",
    howToPlay: "So wird gespielt",
    strategyTips: "Tipps",
    parentNote: "Spieler- und Speicherhinweise",
    progressGuide: "Fortschrittsübersicht",
    progressNote: "Punkte beschreiben nur diese Spielrunde und den lokalen Fortschritt. Sie sind keine formelle Bewertung.",
    beginner: "Anfang",
    good: "Gut",
    excellent: "Sehr gut",
    faq: "Häufig gestellte Fragen",
    relatedGames: "Ähnliche Spiele",
    relatedIntro: "Dieses Spiel trainiert {skill}. Probiere als Nächstes:",
    relatedBySkill: "Weitere Spiele für {skill}",
    relatedByAge: "Weitere Spiele ab {age}",
    relatedAnimal: "Weitere Tierspiele",
    guideLabel: "Spielinformationen zu {title}",
  };

  const skillLabels = {
    "Animal Knowledge": "Tierwissen",
    Memory: "Gedächtnis",
    Reading: "Lesen",
  };

  const games = {
    "animal-quiz": {
      title: "Tierquiz",
      age: "6+",
      difficulty: "Einfach",
      time: "5–8 Minuten",
      gameplay: "Tierquiz",
      genre: ["Quiz", "Lernspiel", "Tiere"],
      skills: ["Animal Knowledge", "Memory", "Reading"],
      guideKicker: "WeightPlay Spielanleitung für Kinder",
      guideTitleSuffix: "Spielanleitung",
      intro: "Tierquiz ist ein kostenloses Wissensspiel für Kinder mit 30 gespeicherten Levels und zehn Tierfragen pro Level. Die Sammlung umfasst 20 vertraute Tierarten. Anfangs helfen klare Bilder und kurze Hinweise zu Körpermerkmalen. Später werden Bilder weichgezeichnet oder als Silhouette gezeigt, eine vierte Antwort kommt hinzu und Hinweise zu Lebensraum, Verhalten, Nahrung und Aussehen werden kombiniert. Jedes fünfte Level ist ein Junior-Expertencheck. Es gibt keinen Zeitdruck, und eine falsche Antwort beendet das Level nicht.",
      story: [
        "Die Kampagne ist eine Tierforschungsreise. Mit jeder richtigen Bestimmung ergänzt der Spieler sein Feldnotizbuch. Bild, Tiername und geschriebene Hinweise gehören immer zum selben gesuchten Tier. Nach zehn Bestimmungen wird das Kapitel gespeichert und die nächste Untersuchung freigeschaltet.",
        "Die Hinweise erklären, warum eine Antwort passt: Beim Löwen helfen Mähne, afrikanische Graslandschaft und Rudelverhalten; beim Pinguin kalte Küsten, Fisch und enges Zusammenrücken; beim Elefanten Rüssel, Pflanzennahrung und das Spritzen mit Wasser. Level 30 schließt alle sechs Lerngruppen mit einem letzten Mix aus verschiedenen Hinweisen ab.",
      ],
      systems: [
        "Jedes Level enthält zehn verschiedene gesuchte Tiere. Die ersten Levels zeigen drei große Antwortmöglichkeiten, spätere Nahrungs-, Misch- und Expertenlevels vier. Die Schaltflächen bleiben dabei gleich gut erreichbar.",
        "Klare Porträts unterstützen das Wiedererkennen. In Rätselbild-Levels sind Details absichtlich weicher, in Silhouetten-Levels fehlen die Farben. So werden Umriss und geschriebene Hinweise wichtiger. Der zugängliche Bildname bleibt erhalten.",
        "Merkmal-Hinweise beschreiben sichtbare Eigenschaften, Lebensraum-Hinweise den Aufenthaltsort, Verhaltens-Hinweise typische Handlungen und Nahrungs-Hinweise das Futter. Expertenlevels verbinden mehrere Hinweisarten.",
        "Nach einer falschen Antwort bleibt die Frage offen und lädt freundlich zu einem neuen Versuch ein. Nach einer richtigen Antwort folgt eine kurze sichtbare Lernpause mit einer Tierinformation, bevor die nächste Frage erscheint.",
        "Nach zehn richtigen Antworten werden Abschluss, Bestwert und das nächste freigeschaltete Level nur in diesem Browser gespeichert. Im Ergebnis kann die Untersuchung wiederholt oder zur genau passenden Levelkarte zurückgekehrt werden.",
        "Es gibt kein Konto, keine Rangliste, keinen Kauf, keinen Timer, keine Leben und keine Schulnote. Kampagnenziel ist der Abschluss aller 30 Levels; Wiederholen dient dem Üben und einem neuen Versuch mit zehn richtigen Antworten.",
      ],
      how: [
        "Drücke auf „Spiel starten“ und wische auf der waagerechten Levelauswahl zu einer freigeschalteten Untersuchung.",
        "Sieh dir Porträt, Rätselbild oder Silhouette an und lies alle Hinweise darunter.",
        "Vergleiche die Hinweise mit den drei oder vier Tiernamen und wähle eine Antwort.",
        "Nutze nach einer falschen Antwort die Rückmeldung für einen neuen Versuch. Lies nach einer richtigen Antwort die kurze Tierinformation.",
        "Bestimme alle zehn Tiere, um den Abschluss zu speichern und genau das nächste Level freizuschalten.",
      ],
      strategyTips: [
        "Nenne bei einem klaren Bild zuerst ein sichtbares Merkmal, bevor du die Antworten liest.",
        "Achte bei Rätselbildern stärker auf den Lebensraum-Hinweis als auf die weicheren Farben.",
        "Vergleiche bei Silhouetten besonders Rüssel, Hälse, Panzer, Ohren und Körperformen.",
        "Lies im Junior-Expertencheck jeden Hinweis; erst die Kombination beschreibt genau ein Tier.",
        "Streiche bei vier Antworten zuerst Tiere, die nicht im genannten Lebensraum leben oder die genannte Nahrung nicht fressen.",
        "Nimm dir Zeit für die Tierinformation nach einer richtigen Antwort.",
      ],
      progression: [
        "Levels 1–5 führen die Tiersammlung mit klaren Bildern und Merkmal-Hinweisen ein. Level 5 ergänzt einen zweiten Hinweis und vier Antworten.",
        "Levels 6–10 behandeln Lebensräume und nutzen weichere Rätselbilder. Level 10 verbindet Lebensraum und sichtbare Merkmale.",
        "Levels 11–15 trainieren das Erkennen von Silhouetten. Level 15 schließt das Kapitel mit gemischten Hinweisen und vier Antworten ab.",
        "Levels 16–20 konzentrieren sich auf Bewegung und Sozialverhalten. Level 20 verbindet Verhalten und Lebensraum.",
        "Levels 21–25 nutzen vier Antworten sowie Hinweise zu Nahrung und Tierfamilien. Level 25 ergänzt sichtbare Merkmale.",
        "Levels 26–30 bilden den Junior-Expertenmix. Level 30 zeigt vier Antworten, eine Silhouette und drei zusammengehörige Hinweise zu Merkmal, Lebensraum und Verhalten.",
      ],
      designNote: "Zehn Fragen wiederholen ein Lernthema, ohne dass sich eine kurze Kinderspielrunde wie eine lange Prüfung anfühlt. Die Schwierigkeit wächst durch andere hilfreiche Hinweise, nicht durch kleinere Ziele oder Zeitdruck. Weichzeichnung und Silhouette sind Lernformen, keine versteckten Trefferflächen; die großen Antwortschaltflächen bleiben für Touch, Maus und Tastatur erhalten. Die Lernpause zählt nur sichtbare Spielzeit, damit ein App-Wechsel keine Tierinformation überspringt. Die Kids-Seite lädt keine Werbung und enthält weder Werbefläche noch Konto, Kauf, Rangliste oder Diagnoseversprechen.",
      parent: "Tierquiz kann Gespräche über Tiernamen, Lebensräume, Nahrung, Körpermerkmale und Verhalten anregen. Kinder, die noch lesen lernen, können mit einem Erwachsenen spielen, der die Hinweise vorliest. Sterne und Lernbericht beschreiben nur diese Spielrunde; sie sind keine Schulnote, kein IQ-Ergebnis, keine Entwicklungsdiagnose und kein Vergleich mit anderen Kindern. Der Fortschritt bleibt im aktuellen Browser und kann beim Löschen der Browserdaten verschwinden. Ein Kinderprofil ist nicht nötig, und die Kids-Seite lädt keine Werbung.",
      faq: [
        ["Wie viele Levels und Fragen gibt es?", "Es gibt 30 gespeicherte Levels mit jeweils zehn verschiedenen Tierfragen."],
        ["Warum ist das Tierbild manchmal unscharf oder dunkel?", "Lebensraum-Levels nutzen weichere Rätselbilder. In Silhouetten- und Expertenlevels werden Umriss und Hinweise wichtiger als die Farbe."],
        ["Was passiert nach einer falschen Antwort?", "Die Frage bleibt offen. Der Spieler kann ohne Fortschrittsverlust eine andere Antwort versuchen."],
        ["Warum gibt es in manchen Levels vier Antworten?", "Spätere Nahrungs-, Misch- und Expertenlevels ergänzen eine vierte Tierart, nachdem die Sammlung eingeführt wurde."],
        ["Wird der Fortschritt gespeichert?", "Freigeschaltete Levels, Abschlüsse und Bestwerte werden nur in diesem Browser gespeichert."],
        ["Funktioniert das Spiel auf dem Handy und mit Tastatur?", "Ja. Dieselbe feste Anordnung unterstützt Touch, Maus und Tastatur."],
        ["Ist ein Konto erforderlich?", "Nein. Anmeldung und Kinderprofil sind nicht nötig. Beim Löschen der Browserdaten kann der lokale Fortschritt verloren gehen."],
        ["Gibt es auf der Kids-Seite Werbung?", "Nein. Tierquiz lädt keine Werbung und erzeugt keine Werbefläche."],
        ["Ist der Lernbericht eine offizielle Beurteilung?", "Nein. Er ist eine freundliche Spielrückmeldung und kein Schul-, IQ-, Gesundheits- oder Entwicklungstest."],
      ],
    },
    "animal-orb-fortress": {
      title: "Tierische Orbfestung",
      difficulty: "Schwierig",
      time: "5 bis 8 Minuten pro Route",
      gameplay: "Abprall-Verteidigungs-Roguelite",
      genre: ["Abpraller", "Actionstrategie", "Roguelite", "Tiere"],
      skills: ["Logic", "Problem Solving", "Focus"],
      guideKicker: "WeightPlay-Leitfaden für Originalspiele",
      guideTitleSuffix: "Spielanleitung",
      noteTitle: "Spieler- und Speicherhinweise",
      hideScoreBands: true,
      intro: "Tierische Orbfestung ist eine Verteidigungskampagne mit 30 Routen, in der du die Arena liest, bevor du eine Geisterkugel abfeuerst. Jede Route besteht aus drei zusammenhängenden Wellen. Ziehe vom Löwenwächter, um eine Bahn über Wände und Spiegelpfeiler vorzusehen, lasse die Kugelsalve los und beschütze den Kristallkern vor vorrückenden Schattenbestien. Sechs Regionen mit je fünf Routen führen Rüstung, Schutzanker, Phasenwechsel, Kristallspalter, bewegliche Spiegelpfeiler, angekündigte Anstürme und sechs unterschiedliche Gebietsbosse ein. Zwischen den Wellen verändert eine Segnung den laufenden Überfall; zwischen den Routen verbessern Sternsteine vier dauerhafte Festungsräume.",
      story: [
        "Die Kristallfestung steht am Knotenpunkt von sechs Wächterwegen: Kristallwald, Dornenwerkstätten, Mondruinen, Spiegelkammer, Sturmbastion und Herz der Finsternis. Als der Kern instabile Impulse aussandte, folgten Schattenbestien diesen Wegen ins Innere. Der Löwenwächter darf den Kern nicht verlassen. Deshalb beginnt jeder Kampf in der Kugelkammer und lenkt Geisterkugeln über Wände und Spiegel auf die Eindringlinge.",
        "Jede befreite Route stabilisiert einen Weg für die Reparaturtrupps. Der Wurzelgolem bewacht das Waldtor, der Rankenrücken-Koloss besetzt die Dornenesse, die Mondirrlicht-Matriarchin durchquert den Mondweg, der Prismenpanzer-Regent kontrolliert die Spiegelkammer, der Sturmhorn-Wächter markiert die Angriffsbahnen des Unwetters und der Leerenkern-Kaiser versiegelt die letzte Kammer in drei Phasen. Route 30 verbindet alle sechs Wege erneut und beendet den verdorbenen Impuls."
      ],
      systems: [
        "Zielen und Abpraller: Ziehe vom Werfer, um die erste Bahn zu sehen, und lasse dann los. Die Hauptkugel und eine schwächere Echokugel fliegen in verbundenen Winkeln. Abpraller können mehrere Bahnen durchqueren oder ein verborgenes Ziel erreichen. Geteilte Kugel fügt ein drittes Geschoss hinzu; Durchdringender Glanz verkürzt die Zeit, bis dieselbe Bestie erneut getroffen werden kann.",
        "Drei Wellen pro Route: Welle 1 und 2 führen die jeweilige Gegnerregel ein. Welle 3 nutzt eine entworfene Eliteformation. Die Routen 5, 10, 15, 20, 25 und 30 enden stattdessen mit einem Gebiets-Boss. Nach jeder Welle hält der Kampf für die Wahl einer Segnung an und wird danach mit den verbleibenden Kern-LP und den aktuellen Verbesserungen fortgesetzt.",
        "Besondere Gegner: Gepanzerte Bestien fangen eine feste Anzahl Treffer ab. Unbewegliche Dornenanker schützen regelmäßig nahe Verbündete. Mondirrwische werden bis zu ihrer Rückkehr unberührbar. Kristallspalter teilen sich bei ihrer Niederlage in zwei schnellere Splitter. Stürmer markieren eine Bahn, greifen an und öffnen danach ein kurzes Zeitfenster.",
        "Spiegelpfeiler: Fortgeschrittene Routen stellen einen oder zwei feste sechseckige Pfeiler in die Arena. Kugeln prallen wirklich an ihnen ab und erschließen Bahnen, die es in den ersten Regionen nicht gibt. Einige Pfeiler bewegen sich waagerecht. Ein zuvor sicherer Winkel kann deshalb noch in derselben Welle seine Wirkung verlieren.",
        "Bossregeln: Der Wurzelgolem baut einen brechbaren Schutz wieder auf. Der Rankenrücken-Koloss ruft Anker und gepanzerte Verstärkung. Die Mondirrlicht-Matriarchin wechselt zwischen sichtbaren und unberührbaren Phasen. Der Prismenpanzer-Regent nimmt nur bei geöffnetem Goldsegment Schaden. Der Sturmhorn-Wächter wird nach seinem Ansturm verwundbar. Der Leerenkern-Kaiser wechselt zweimal die Phase, ruft Eskorten, erneuert seinen Schutz und aktiviert zwei Pfeiler.",
        "Vorübergehende und dauerhafte Stärke: Jede Welle bietet Große Kugel, Geteilte Kugel, Durchdringender Glanz, Schnellladung, Kernschild oder Spähermagnet an. Sternsteine verbessern den Schaden der Kugelschmiede, die anfänglichen Kern-LP der Schildkammer, die Angriffe des Gefährtenquartiers und die Belohnungen des Späherturms. Eine neue Segnungsauswahl für drei Diamanten ist freiwillig, verlangt eine zweite Bestätigung und ist nie zum Freischalten einer Route nötig."
      ],
      how: [
        "Wähle auf der waagerechten Routenkarte eine freigeschaltete Route. Lies Namen, Regel und Warnung, bevor du sie betrittst.",
        "Ziehe vom Löwenwächter in den gewünschten Winkel. Nutze die Vorschau für einen direkten Schuss, einen Wandabpraller, eine Bahn durch die Arena oder eine Spiegelung am Pfeiler.",
        "Lasse los, um die Salve abzufeuern. Beobachte Rüstungsringe, Phasenkonturen, markierte Sturmbahnen, Schutzlinien der Anker und die Signale der Bosse.",
        "Wähle nach Welle 1 und 2 eine Segnung. Eine neue Auswahl kostet drei Diamanten und muss mit einer zweiten Eingabe bestätigt werden.",
        "Halte die Kern-LP bis zum Ende von Welle 3 über null. Ein Sieg speichert die nächste Route und die Sternsteine. Bei einer Niederlage bleiben verdiente Sternsteine und die beste freigeschaltete Route erhalten.",
        "Kehre zur Routenkarte zurück, um Räume zu verbessern, eine abgeschlossene Route erneut zu spielen oder vom Ergebnis direkt zur nächsten Route weiterzugehen."
      ],
      strategyTips: [
        "Ziele nicht immer auf die nächste Bestie. Anker, Spalter und Irrlichter im Hintergrund können mehr Druck erzeugen; erreiche das wichtigste Ziel mit einem Abpraller.",
        "Eine gestrichelte Phasenkontur bedeutet, dass Schaden blockiert wird. Bereite den nächsten Winkel vor und feuere erst, wenn der Gegner wieder fest ist.",
        "Bewegliche Pfeiler sind nützliche Flächen. Ziele ein Stück vor ihre Bewegung, um eine Bahn zu erreichen, die mit den Außenwänden allein unmöglich wäre.",
        "Lies gegen Stürmer und den Sturmhorn-Wächter die markierte Bahn und nutze das Erholungsfenster nach dem Ansturm.",
        "Kernschild und Schnellladung stabilisieren eine gefährliche Route. Große Kugel und Durchdringender Glanz verkürzen gefährliche Phasen. Spähermagnet unterstützt den langfristigen Fortschritt, stoppt aber keinen unmittelbaren Durchbruch.",
        "Bewahre die freiwillige Neuauswahl für Segnungen auf, die wirklich nicht zur Routenregel passen. Alle 30 Routen und sechs Bosse sind ohne Diamanten erreichbar."
      ],
      progression: [
        "Die Routen 1 bis 5 lehren direkte Schüsse, Abpraller an einer Wand, getrennte Bahnen und Zielreihenfolgen. Wurzelkrone ist die erste Prüfung: Der Golem baut seinen Schutz nach einem verwundbaren Zeitfenster wieder auf, also musst du zuerst die Deckung brechen und dann die Öffnung nutzen.",
        "Die Routen 6 bis 10 führen Mehrtreffer-Rüstung und unbewegliche Anker ein. Die Routen 11 bis 15 ergänzen Phasenrhythmus und das erste bewegliche Spiegeltor. Der Rankenrücken-Koloss ruft Schutzobjekte, während die Mondirrlicht-Matriarchin zwischen Unverwundbarkeit und Erholung wechselt.",
        "Die Routen 16 bis 20 ergänzen feste Spiegelpfeiler und Spalter mit schnelleren Splittern. Die Routen 21 bis 25 kündigen Anstürme an und fügen den Sturm-Rhythmus hinzu. Der Prismenpanzer-Regent dreht sein verwundbares Segment; der Sturmhorn-Wächter muss seinen Ansturm beenden, bevor er verletzt werden kann.",
        "Die Routen 26 bis 30 verbinden Rüstung, Anker, Phasen, Spalter, Stürmer und bewegliche Pfeiler. Route 29 nutzt das gesamte Repertoire gewöhnlicher Gegner. Route 30 ergänzt zwei Phasenwechsel des Kaisers, vier Unterstützungsrufe, erneuerte Schilde und zwei aktive Pfeiler."
      ],
      designNote: "Drei kurze Wellen machen jede Route zu einer klaren Zielaufgabe statt zu einer langen Ausdauerprüfung. Eine Pause erhält den Kernschaden und die aktuelle Zusammenstellung. Frühe Regionen vermitteln berechenbare Geometrie an den Außenwänden; spätere Pfeiler schaffen neue Flächen. Ringe, Schilde, Bahnmarkierungen und eigene Illustrationen zeigen die Gegenmaßnahmen. Ziehen ist die Hauptsteuerung auf dem Telefon. Mit der Tastatur ändern die linke und rechte Pfeiltaste den Winkel; Leertaste oder Eingabetaste feuert.",
      parent: "Der Browser speichert auf diesem Gerät die beste freigeschaltete Route, Sternsteine, die Zahl der Durchläufe und die Stufen der vier Räume. Ein Konto ist nicht nötig. Das Löschen der Websitedaten kann diesen Fortschritt entfernen. Eine neue Segnungsauswahl mit Diamanten ist freiwillig und für keine der 30 Routen erforderlich. Ergebnisse und Berichte beschreiben nur die jeweilige Spielrunde und sind keine formelle Bewertung.",
      faq: [
        ["Was ist das Ziel einer Route?", "Beschütze den Kern für drei Wellen. Nach Welle 3 wird die Route gespeichert, Sternsteine werden vergeben und die nächste Route wird freigeschaltet."],
        ["Verwendet jede Route denselben Boss?", "Nein. Jede fünfte Route endet mit einem anderen Gebiets-Boss. Die übrigen Routen schließen mit entworfenen Eliteformationen ab."],
        ["Warum flog meine Kugel durch ein Mondirrlicht?", "Eine gestrichelte Kontur zeigt eine vorübergehend unberührbare Phase. Warte, bis der Gegner wieder fest wird."],
        ["Wozu dienen Spiegelpfeiler?", "Sie sind echte Abprallflächen in der Arena. Fortgeschrittene Pfeiler bewegen sich und verändern die verfügbaren Bahnen."],
        ["Brauche ich Diamanten, um die Kampagne zu beenden?", "Nein. Sie dienen nur dazu, nach einer Bestätigung einmal die drei Segnungen einer Welle neu auszuwählen."],
        ["Was geschieht nach einer Niederlage?", "Der Überfall endet, aber verdiente Sternsteine und die beste freigeschaltete Route bleiben erhalten."],
        ["Welcher Fortschritt wird gespeichert?", "Die beste Route, Sternsteine, die Zahl der Durchläufe sowie die Stufen von Kugelschmiede, Kernschildkammer, Gefährtenquartier und Späherturm werden in diesem Browser gespeichert."]
      ],
    },
  };

  games["spider-solitaire"] = {
    ...(games["spider-solitaire"] || {}),
    title: "Spider-Solitär",
  };

  const gameplayProfiles = {
    "animal-quiz": { gameplay: "Tierquiz", genre: ["Quiz", "Lernspiel", "Tiere"] },
    "animal-orb-fortress": { gameplay: "Abprall-Verteidigungs-Roguelite", genre: ["Abpraller", "Actionstrategie", "Roguelite", "Tiere"] },
  };

  window.WeightPlayGameInfoLocales = window.WeightPlayGameInfoLocales || {};
  window.WeightPlayGameInfoLocales.de = { labels, skillLabels, games, gameplayProfiles };
})();
