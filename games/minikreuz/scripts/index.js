let data = {};
let success = true;
let mistakes = 0;

let gameState = {
	ended: false,
	timeDiff: 0,
	showedComplete: false,
	previousSelected: -1,
	selectOrientation: "horizontal",
	letters: {}
};

function initialiseGrid() {
	let grid = document.getElementById("grid");

	for (let y = 0; y < data.puzzle.size.y; y++) {
		let row = document.createElement("div");
		row.classList.add("row");
		row.id = "row" + y.toString();

		for (let x = 0; x < data.puzzle.size.x; x++) {
			let tile = document.createElement("div");
			tile.classList.add("tile");
			tile.classList.add("none");
			tile.id = "tile" + (y * data.puzzle.size.y + x).toString();

			row.appendChild(tile);
		};

		grid.appendChild(row);
	};
};

function populateGrid() {
	for (const [_, word] of data.puzzle.horizontal.entries()) {
		// Set letters
		for (const [index, letter] of word.word.split("").entries()) {
			let tileNumber = word.y * data.puzzle.size.y + (word.x + index);
			createInput(tileNumber, letter);
		};

		// set number
		let tileNumber = word.y * data.puzzle.size.y + word.x;
		let startTile = document.getElementById("tile" + tileNumber);

		let number = document.createElement("div");
		number.classList.add("puzzle-number");
		number.innerHTML = word.n;
		
		startTile.appendChild(number);
	};

	for (const [_, word] of data.puzzle.vertical.entries()) {
		// Set letters
		for (const [index, letter] of word.word.split("").entries()) {
			let tileNumber = (word.y + index) * data.puzzle.size.x + word.x;
			createInput(tileNumber, letter);
		};

		// set number
		let tileNumber = word.y * data.puzzle.size.y + word.x;
		let startTile = document.getElementById("tile" + tileNumber);
		
		if (startTile.childNodes[0].nodeName == "INPUT") {
			let number = document.createElement("div");
			number.classList.add("puzzle-number");
			number.innerHTML = word.n;
	
			startTile.appendChild(number);
		};
	};
};

async function initialisePuzzle() {
	data = await puzzleLoadEvent();

	// initialise game
	initialiseGrid();
	populateGrid();

	// Load state
	loadState();

	// highlight initial word
	let tileNumber = document.querySelector(".tile:not(.none)").id.substring(4);
	let word = getWord(tileNumber, gameState.selectOrientation);
	highlightWord(word);

	// select first input
	gameState.previousSelected = data.puzzle.horizontal[0].x + data.puzzle.horizontal[0].y * data.puzzle.size.y;
	updateLocalStorage("previousSelected", gameState.previousSelected);
	focusInput();

	// populate letters with stored
	loadLetters();

	// Create listeners
	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.addEventListener('click', onTileClick);
		input.addEventListener('keydown', onTileInput);
	});
	
	// Create timer
	window.setInterval(() => {
		if (!gameState.ended) {
			gameState.timeDiff = gameState.timeDiff + 1000;
			updateLocalStorage("timeDiff", gameState.timeDiff);
			document.getElementById("timer").innerHTML = "Timer: " + getResults();
		};
	}, 1000);
};

document.addEventListener('DOMContentLoaded', (event) => {
	// Once DOM loaded, run initialise
	initialisePuzzle();
});