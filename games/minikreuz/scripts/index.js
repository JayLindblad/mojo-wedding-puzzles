let data = {};
let success = true;
let mistakes = 0;

let ended = false;
let started = Date.now();
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

			let tile = document.getElementById("tile" + tileNumber.toString());
			tile.classList.remove("none");

			tile.innerHTML = "";

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
		};
	};

	for (const [_, word] of data.puzzle.vertical.entries()) {
		// Set letters
		for (const [index, letter] of word.word.split("").entries()) {
			let tileNumber = (word.y + index) * data.puzzle.size.x + word.x;

			let tile = document.getElementById("tile" + tileNumber.toString());
			tile.classList.remove("none");
		};
	};
};

async function initialisePuzzle() {
	data = await puzzleLoadEvent();

	// initialise game
	initialiseGrid();
	populateGrid();

	// highlight initial word
	let tileNumber = document.querySelector(".tile:not(.none)").childNodes[0].attributes.tilenumber.value;
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
	
	// Create timer
	window.setInterval(() => { 
		localStorage.setItem(data.metadata.id + "_started", started);
		timeDiff = Date.now() - started;
		document.getElementById("timer").innerHTML = "Timer: " + getResults();
	}, 1000);

	// Load state
	loadState();
};

document.addEventListener('DOMContentLoaded', (event) => {
	// Once DOM loaded, run initialise
	initialisePuzzle();
});