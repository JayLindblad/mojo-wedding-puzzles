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

	if (selectOrientation == "horizontal") {
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

	previousSelected = tileNumber;
	document.getElementById("tileLetter" + tileNumber.toString()).focus();
};

function getWord(tileNumber, selectOrientation) {
	if (selectOrientation == "horizontal") {
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
	document.getElementById("tileLetter" + previousSelected.toString()).focus();
};

function highlightWord(word) {
	let highlighteds = document.querySelectorAll(".highlighted");
	[].forEach.call(highlighteds, function(el) {
		el.classList.remove("highlighted");
	});
	
	// highlight letters of word
	if (selectOrientation == "horizontal") {
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

	for (let w of data.puzzle[selectOrientation].sort((f, s) => { return (f.n - s.n) * (direction ? 1 : -1); })) {
		if (direction) {
			if (w.n > number) {
				previousSelected = w.x + w.y * data.puzzle.size.y;
				return w;
			};
		} else {
			if (w.n < number) {
				previousSelected = w.x + w.y * data.puzzle.size.y;
				return w;
			};
		};
	};

	// if the word is already the highest number in it's orientation
	selectOrientation = selectOrientation == "horizontal" ? "vertical" : "horizontal";
	return nextWord({n: direction ? 0 : 999}, direction);
};