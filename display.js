// Funktion display zur Anzeige von Texten im Paragraphen mit der ID "ausgabe" des HTML-Dokuments und parallel über die Console
var display = function(text) {
  var ausgabeParagraph = document.getElementById('ausgabe');
	ausgabeParagraph.innerHTML = ausgabeParagraph.innerHTML + text + "<br>";
	console.log(text);
	return;
};
