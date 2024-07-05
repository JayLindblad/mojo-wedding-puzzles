function showCompleted() {
	// Count amount of attempts
	mistakes += 1;

	if (!gameState.showedComplete) {
		document.getElementById("completed").classList.add("popup-open");
		gameState.showedComplete = true;
		updateLocalStorage("showedComplete", true);
	};
}

function onTileClick(e) {
	let tileNumber = parseInt(e.target.attributes.tilenumber.value);
	newOrientation = gameState.selectOrientation == "horizontal" ? "vertical" : "horizontal";
	
	if (tileNumber == gameState.previousSelected) {
		gameState.selectOrientation = newOrientation;
	};
	gameState.previousSelected = tileNumber;
	let word = getWord(tileNumber, gameState.selectOrientation);

	if (!word) {
		gameState.selectOrientation = gameState.selectOrientation == "horizontal" ? "vertical" : "horizontal";
		word = getWord(tileNumber, gameState.selectOrientation);
	};

	highlightWord(word);
};

function reset() {
	// Remove results if the game has ended
	if (gameState.ended) {
		document.getElementById("showresults").remove();
	};

	// Remove timer from body
	window.clearInterval(gameState.intervalId);

	clearLetters();
	resetState();

	// Reset timer immediately
	document.getElementById("timer").innerHTML = "Timer: " + getResults();
};

function gameEnd(log) {
	if (log) {
		puzzleEndEvent(data.metadata.id, { success, mistakes, time: gameState.timeDiff });
		gameState.ended = true;
		updateLocalStorage("ended", gameState.ended);
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