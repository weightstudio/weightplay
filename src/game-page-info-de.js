/* Authored German public-game guide resource. Loaded by the shared guide generator. */
(() => {
  const labels = {
    kicker: "WeightPlay Spielanleitung für Kinder",
    titleSuffix: "Kostenloses Kinderspiel",
    gameplay: "Spielart",
    genre: "Genre",
    recommendedAge: "Empfohlenes Alter",
    difficulty: "Schwierigkeit",
    estimatedTime: "Spielzeit",
    skills: "Geübte Fähigkeiten",
    worldAndMission: "Welt und Auftrag",
    gameSystems: "So funktioniert das Spiel",
    progressionAndDifficulty: "Fortschritt und Schwierigkeit",
    developerNote: "Hinweis zur Gestaltung",
    howToPlay: "So wird gespielt",
    strategyTips: "Tipps",
    parentNote: "Für Eltern",
    progressGuide: "Fortschrittsübersicht",
    progressNote: "Punkte dienen nur dem Spielspaß und dem lokalen Fortschritt. Sie sind kein IQ-Test, keine medizinische oder psychologische Diagnose und keine Schulnote.",
    beginner: "Anfang",
    good: "Gut",
    excellent: "Sehr gut",
    faq: "Häufige Fragen",
    relatedGames: "Ähnliche Spiele",
    relatedIntro: "Dieses Spiel übt {skill}. Probiere als Nächstes:",
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
  };

  const gameplayProfiles = {
    "animal-quiz": { gameplay: "Tierquiz", genre: ["Quiz", "Lernspiel", "Tiere"] },
  };

  window.WeightPlayGameInfoLocales = window.WeightPlayGameInfoLocales || {};
  window.WeightPlayGameInfoLocales.de = { labels, skillLabels, games, gameplayProfiles };
})();
