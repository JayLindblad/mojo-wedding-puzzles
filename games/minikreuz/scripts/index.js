let data = {};
let success = true;
let mistakes = 0;

let ended = false;
let timeDiff = 0;
let showedComplete = false;

let previousSelected = -1;
let selectOrientation = "horizontal";

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

	// highlight initial word
	let tileNumber = document.querySelector(".tile:not(.none)").id.substring(4);
	let word = getWord(tileNumber, selectOrientation);
	highlightWord(word);

	// select first input
	previousSelected = data.puzzle.horizontal[0].x + data.puzzle.horizontal[0].y * data.puzzle.size.y;
	focusInput();

	// populate letters with stored
	loadLetters();

	// Create listeners
	const inputs = document.querySelectorAll('input');
	inputs.forEach(input => {
		input.addEventListener('click', onTileClick);
		input.addEventListener('keydown', onTileInput);
	});

	// Load state
	loadState();
	
	// Create timer
	window.setInterval(() => {
		if (!ended) {
			timeDiff = parseInt(timeDiff) + 1000;
			localStorage.setItem(data.metadata.id + "_diff", timeDiff);
			document.getElementById("timer").innerHTML = "Timer: " + getResults();
		};
	}, 1000);
};

document.addEventListener('DOMContentLoaded', (event) => {
	// Once DOM loaded, run initialise
	initialisePuzzle();
});