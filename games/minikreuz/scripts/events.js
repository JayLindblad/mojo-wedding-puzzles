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
	newOrientation = selectOrientation == "horizontal" ? "vertical" : "horizontal";
	
	if (tileNumber == previousSelected) {
		selectOrientation = newOrientation;
	};
	previousSelected = tileNumber;
	let word = getWord(tileNumber, selectOrientation);

	if (!word) {
		selectOrientation = selectOrientation == "horizontal" ? "vertical" : "horizontal";
		word = getWord(tileNumber, selectOrientation);
	};

	highlightWord(word);
};

function reset() {
	clearLetters();
	resetState();

	if (ended) {
		// Reset global vars
		timeDiff = 0;
		ended = false;
		success = true;
		mistakes = 0;
	};
};

function gameEnd(log) {
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