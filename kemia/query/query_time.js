goog.require('goog.testing.jsunit');
goog.require('kemia.io.smiles.SmilesParser');
goog.require('kemia.query.DFSMapper');
goog.require('kemia.query.SmilesCompiler');
goog.require('kemia.io.smiles.Testdata');

function debug(text, noNewLine) {
	var logDiv = document.getElementById("logDiv");
	if (!logDiv) {
		var body = document.getElementsByTagName("body")[0];
		logDiv = document.createElement("div");
		logDiv.id = "logDiv";
		body.appendChild(logDiv);
	}
	if (noNewLine) {
		logDiv.innerHTML += text;
	} else {
		logDiv.innerHTML += text + "<br>";
	}
}

function callback(maps) {
}

var i = 0;
function doNext() {
	var query = new kemia.query.SmilesCompiler().compile('c1ccccc1');
	var mapper = new kemia.query.DFSMapper(query);
	var molecule = kemia.io.smiles.SmilesParser.parse(kemia.io.smiles.Testdata.smiles[i]);
	var maps = mapper.mapAll(molecule);
	debug("match " + (i + 1) + ": " + maps.length);
	i++;
	if (i < kemia.io.smiles.Testdata.smiles.length) {
		setTimeout(doNext, 0);
	}
}

function testTimeParse() {
	doNext();
}
