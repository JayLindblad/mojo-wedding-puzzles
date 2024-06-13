function showCompleted() {
	// Count amount of attempts
	mistakes += 1;

	if (!showedComplete) {
		document.getElementById("completed").classList.add("popup-open");
		showedComplete = true;
	};
}

function onTileClick(e) {
	let tileNumber = e.target.attributes.tilenumber.value;
	if (tileNumber == previousSelected) {
		selectOrientation = selectOrientation == "horizontal" ? "vertical" : "horizontal";
	};
	previousSelected = tileNumber;

	let word = getWord(tileNumber, selectOrientation);

	highlightWord(word);
};

function reset() {
	clearLetters();
	resetState();

	if (ended) {
		// Reset global vars
		ended = false;
		success = true;
		mistakes = 0;
	};
};

function gameEnd(log) {
	timeDiff = localStorage.getItem(data.metadata.id + "_diff") == null ? Date.now() - started : localStorage.getItem(data.metadata.id + "_diff");
	localStorage.setItem(data.metadata.id + "_diff", timeDiff);

	if (log) {
		puzzleEndEvent(data.metadata.id, success, mistakes, timeDiff);
		ended = true;
		localStorage.setItem(data.metadata.id + "_ended", ended);
	};
	
	let buttons = document.getElementById("buttons");
	let showResults = document.createElement("div");
	showResults.setAttribute("onclick", "showPopup('results')");
	showResults.classList = "showresults button";
	showResults.innerHTML = "Ergebnis anzeigen";
	showResults.id = "showresults";
	buttons.appendChild(showResults);

	let results = document.getElementById("results-inner");
	results.innerHTML = `Ausgefüllt in <b>${getResults()}</b>`;

	showPopup("results");
};