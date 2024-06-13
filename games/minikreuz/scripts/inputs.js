function onKeyPress(e) {
	e.preventDefault();

	// Check if gameEnded to prevent modification
	if (ended == true) {
		return;
	};

	// Check if key is letter
	if ("abcdefghijklmnopqrstuvwxyz".indexOf(e.key) < 0) {
		return;
	};

	let tileNumber = e.target.attributes.tilenumber.value;
	let word = getWord(tileNumber, selectOrientation);

	moveTile(tileNumber, word, true);

	// If the end of word has been reached 
	// tileNumber and current tileNumber=previousSelected match
	// go to next word
	if (tileNumber == previousSelected) {
		forward();
	};

	// Set input value to key
	e.target.value = e.key;

	// save to localstorage
	saveLetters();

	// Check if game is complete
	let outcome = checkInputs();
	if (outcome) {
		return;
	};
};

function onTileInput(event) {
	let tileNumber = previousSelected;
	let word = getWord(tileNumber, selectOrientation);

	switch(event.key) {
		case 'Tab':
			event.preventDefault();
			forward();
			break;
		case 'Enter':
			event.preventDefault();
			forward();
			break;
		case 'Backspace':
			event.preventDefault();
			let tile = document.getElementById("tileLetter" + tileNumber.toString());
			tile.value = "";
			saveLetters();
			moveTile(tileNumber, word, false);

			// Go to previous word
			if (tileNumber == previousSelected) {
				backward();
				// Set to last letter of the word
				word = getWord(previousSelected, selectOrientation);
				if (selectOrientation == "horizontal") {
					previousSelected = (word.x + word.word.length - 1) + word.y * data.puzzle.size.y;
				} else {
					previousSelected = word.x + (word.y + word.word.length - 1) * data.puzzle.size.y;
				};
				focusInput();
			};
			
			break;
		case 'ArrowUp':
			if (selectOrientation == "vertical") {
				moveTile(tileNumber, word, false);
			} else {
				selectOrientation = "vertical";
				word = getWord(tileNumber, selectOrientation);
				highlightWord(word);
			};
			break;
		case 'ArrowDown':
			if (selectOrientation == "vertical") {
				moveTile(tileNumber, word, true);
			} else {
				selectOrientation = "vertical";
				word = getWord(tileNumber, selectOrientation);
				highlightWord(word);
			};
			break;
		case 'ArrowLeft':
			if (selectOrientation == "horizontal") {
				moveTile(tileNumber, word, false);
			} else {
				selectOrientation = "horizontal";
				word = getWord(tileNumber, selectOrientation);
				highlightWord(word);
			};
			break;
		case 'ArrowRight':
			if (selectOrientation == "horizontal") {
				moveTile(tileNumber, word, true);
			} else {
				selectOrientation = "horizontal";
				word = getWord(tileNumber, selectOrientation);
				highlightWord(word);
			};
			break;
		default:
			onKeyPress(event);
	};
};