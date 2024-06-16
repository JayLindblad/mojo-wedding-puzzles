function createInput(tileNumber, letter) {
	let tile = document.getElementById("tile" + tileNumber.toString());
	tile.classList.remove("none");

	for (let cN of tile.childNodes) {
		if (cN.nodeName == "INPUT") {
			cN.remove();
		};
	};

	let tileLetter = document.createElement("input");
	tileLetter.id = "tileLetter" + tileNumber.toString();
	tileLetter.setAttribute("maxLength", 1);
	tileLetter.setAttribute("tileNumber", tileNumber.toString());
	tileLetter.setAttribute("letter", letter);
	tileLetter.setAttribute("autocomplete", "off");
	tileLetter.setAttribute("readonly", "readonly");
	tileLetter.setAttribute("inputmode", "none");

	tileLetter.value = "";

	tile.appendChild(tileLetter);
}

function moveTile(tileNumber, word, direction) {
	// handle skipping to next input
	let x = tileNumber % data.puzzle.size.x;
	let y = Math.floor(tileNumber / data.puzzle.size.y);

	if (gameState.selectOrientation == "horizontal") {
		if (direction) {
			if (x < word.x + word.word.length - 1) {
				x += 1;
				tileNumber = y * data.puzzle.size.y + x;
			};
		} else {
			if (x > word.x) {
				x -= 1;
				tileNumber = y * data.puzzle.size.y + x;
			};
		};
	} else {
		if (direction) {
			if (y < word.y + word.word.length - 1) {
				y += 1;
				tileNumber = y * data.puzzle.size.y + x;
			};
		} else {
			if (y > word.y) {
				y -= 1;
				tileNumber = y * data.puzzle.size.y + x;
			};
		};
	};

	gameState.previousSelected = tileNumber;
	document.getElementById("tileLetter" + tileNumber.toString()).focus();
};

function moveTextInput(tileNumber, word, n = 0, move = true, alreadyFilled = true) {
	// handle skipping to next input
	let x = tileNumber % data.puzzle.size.x;
	let y = Math.floor(tileNumber / data.puzzle.size.y);

	// Check if word is completely filled
	let allFilled = true;
	if (gameState.selectOrientation == "horizontal") {
		for (let i = word.x; i < (word.word.length + word.x); i++) {
			let wordTile = y * data.puzzle.size.y + i;
			if (document.getElementById("tileLetter" + wordTile.toString()).value == "") {
				allFilled = false;
				break;
			};
		};
	} else {
		for (let i = word.y; i < (word.word.length + word.y); i++) {
			let wordTile = i * data.puzzle.size.y + x;
			if (document.getElementById("tileLetter" + wordTile.toString()).value == "") {
				allFilled = false;
				break;
			};
		};
	};

	if (move && gameState.selectOrientation == "horizontal") {
		if (x < word.x + word.word.length - 1) {
			x += 1;
		} else if (!allFilled) {
			// if the word is not completely filled
			// skip back to beginning and go to non-filled tile
			x = word.x;
			alreadyFilled = false;
		};
		tileNumber = y * data.puzzle.size.y + x;
	} else if (move) {
		if (y < word.y + word.word.length - 1) {
			y += 1;
		} else if (!allFilled) {
			// if the word is not completely filled
			// skip back to beginning and go to non-filled tile
			y = word.y;
			alreadyFilled = false;
		};
		tileNumber = y * data.puzzle.size.y + x;
	};

	document.getElementById("tileLetter" + tileNumber.toString()).focus();
	gameState.previousSelected = tileNumber;

	console.log(alreadyFilled, allFilled);
	if (
		!alreadyFilled && 
		document.getElementById("tileLetter" + tileNumber.toString()).value != "" &&
		n < data.puzzle.size.x && 
		!allFilled
	) {
		moveTextInput(tileNumber, word, n+1, true, false);
	};
};

function getWord(tileNumber, orientation) {
	if (orientation == "horizontal") {
		for (const [_, word] of data.puzzle.horizontal.entries()) {
			let x = tileNumber % data.puzzle.size.x;
			let y = Math.floor(tileNumber / data.puzzle.size.y);
	
			if (y == word.y && x >= word.x && x <= word.x + word.word.length) {
				return word;
			};
		};
	} else {
		for (const [_, word] of data.puzzle.vertical.entries()) {
			let x = tileNumber % data.puzzle.size.x;
			let y = Math.floor(tileNumber / data.puzzle.size.y);
	
			if (x == word.x && y >= word.y && y <= word.y + word.word.length) {
				return word;
			};
		};
	};
};

function checkInputs() {
	// Get all tiles
	let tiles = document.querySelectorAll(".tile:not(.none) input");
	let correct = true;
	let completed = true;

	[].forEach.call(tiles, function(el) {
		if (el.value.toUpperCase() != el.attributes.letter.value.toUpperCase()) {
			correct = false;
		};
		if (el.value == "") {
			completed = false;
		};
	});

	if (correct) {
		gameEnd(true);
		return true;
	} else if (completed) {
		showCompleted();
	};

	return false;
};

function focusInput() {
	document.getElementById("tileLetter" + gameState.previousSelected.toString()).focus();
};

function highlightWord(word) {
	let highlighteds = document.querySelectorAll(".highlighted");
	[].forEach.call(highlighteds, function(el) {
		el.classList.remove("highlighted");
	});
	
	// highlight letters of word
	if (gameState.selectOrientation == "horizontal") {
		for (let x = word.x; x < word.x + word.word.length; x++) {
			let tileNumber = word.y * data.puzzle.size.y + x;
			let tile = document.getElementById("tile" + tileNumber.toString());
			tile.classList.add("highlighted");
		};
	} else {
		for (let y = word.y; y < word.y + word.word.length; y++) {
			let tileNumber = y * data.puzzle.size.y + word.x;
			let tile = document.getElementById("tile" + tileNumber.toString());
			tile.classList.add("highlighted");
		};
	};

	let clue = document.getElementById("clue");
	clue.innerHTML = word.clue;
};

function nextWord(word, direction) {
	let number = word.n;

	for (let w of data.puzzle[gameState.selectOrientation].sort((f, s) => { return (f.n - s.n) * (direction ? 1 : -1); })) {
		if (direction) {
			if (w.n > number) {
				gameState.previousSelected = w.x + w.y * data.puzzle.size.y;
				moveTextInput(gameState.previousSelected, w, 0, false, false);
				return w;
			};
		} else {
			if (w.n < number) {
				gameState.previousSelected = w.x + w.y * data.puzzle.size.y;
				moveTextInput(gameState.previousSelected, w, 0, false, false);
				return w;
			};
		};
	};

	// if the word is already the highest number in it's orientation
	gameState.selectOrientation = gameState.selectOrientation == "horizontal" ? "vertical" : "horizontal";
	return nextWord({n: direction ? 0 : 999}, direction);
};