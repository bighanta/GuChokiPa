<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

let scores = ref();

onMounted(() => {
  axios.get("http://localhost:8080/api/scores")
    .then((response) => {
    console.log(response.data);
  });
});

console.log(posts);
let ergebnisComputer = 0;
let ergebnisSpieler = 0;
// Funktion "display" zur Anzeige von Texten im Paragraphen mit der ID "ausgabe" des HTML-Dokuments
var display = function (text) {
  var ausgabeParagraph = document.getElementById("ausgabe");
  ausgabeParagraph.innerHTML = text + "<br>";
  return;
};

// Funktion "displayErgebnis" zur Anzeige von Texten im Paragraphen mit der ID "ergebnis" des HTML-Dokuments
var displayErgebnis = function (text) {
  var ausgabeParagraph = document.getElementById("ergebnis");
  ausgabeParagraph.innerHTML = text + "<br>";
  return;
};

function postScore(score) {
  axios.post('http://localhost:8080/api/scores', JSON.stringify({ player_id: 1, player_name: "Test", score: score}), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

/* Funktion "vergleich" vergleicht die Eingaben und gibt das gewinnende Element zurück */
var vergleich = function (auswahlSpieler, auswahlComputer) {
  auswahlSpieler = auswahlSpieler.toLowerCase().trim();
  auswahlComputer = auswahlComputer.toLowerCase().trim();
  if (auswahlSpieler === auswahlComputer) {
    ergebnisComputer++;
    ergebnisSpieler++;
    return "Unentschieden!";
  } else if (auswahlSpieler === "stein") {
    if (auswahlComputer === "schere") {
      ergebnisSpieler++;
      return "Stein gewinnt";
    } else {
      ergebnisComputer++;
      return "Papier gewinnt!";
    }
  } else if (auswahlSpieler === "papier") {
    if (auswahlComputer === "stein") {
      ergebnisSpieler++;
      return "Papier gewinnt!";
    } else {
      ergebnisComputer++;
      return "Schere gewinnt!";
    }
  } else if (auswahlSpieler === "schere") {
    if (auswahlComputer === "stein") {
      ergebnisComputer++;
      return "Stein gewinnt!";
    } else {
      ergebnisSpieler++;
      return "Schere gewinnt!";
    }
  } else {
    return "Falsche Eingabe!?";
  }
};

var erzeugeComputerAuswahl = function () {
  var zufallsZahl = Math.random();
  if (zufallsZahl < 0.34) {
    return "stein";
  } else if (zufallsZahl <= 0.67) {
    return "papier";
  } else {
    return "schere";
  }
};

/* Hauptteil */
/* --------- */
var spielen = function (spielerAuswahl) {
  var meldung;
  var ergebnis;
  var computerAuswahl = erzeugeComputerAuswahl();

  meldung =
    "Du hast " +
    spielerAuswahl.substr(0, 1).toUpperCase() +
    spielerAuswahl.substr(1) +
    " und der Computer hat " +
    computerAuswahl.substr(0, 1).toUpperCase() +
    computerAuswahl.substr(1) +
    ".\n";
  meldung = meldung + vergleich(spielerAuswahl, computerAuswahl);
  display(meldung);

  ergebnis = "Spieler: " + ergebnisSpieler + " / Computer: " + ergebnisComputer;
  displayErgebnis(ergebnis);
};
</script>

<template style="width:80%">
    <p class="m-8" id="ergebnis">Spieler 1: 0 / Spieler 2: 0</p>

    <div>
        <button class="mx-5" @click="spielen('schere')">✂️ Schere</button>
        <button class="mx-5" @click="spielen('stein')">🪨 Stein</button>
        <button class="mx-5 mb-8" @click="spielen('papier')">📄 Papier</button>
    </div>

    <p id="ausgabe"></p>

    <table style="width: 100%">
        <tr style="background-color: darkslategrey">
            <th>Platz</th>
            <th>Punkte</th>
            <th>Spieler</th>
        </tr>
        <tr>
            <th style="background-color: gold;">1.</th>
            <td>XXX</td>
            <td>Tick</td>
        </tr>
        <tr>
            <th style="background-color: silver">2.</th>
            <td>XXX</td>
            <td>Trick</td>
        </tr>
        <tr>
            <th style="background-color: coral">3.</th>
            <td>XXX</td>
            <td>Tom</td>
        </tr>
    </table>
</template>

<styles scoped>
</styles>
