let data = {
	metadata: {
		id: "add"
	},
	puzzle: {
		size: {
			x: 5,
			y: 5
		}
	}
};

let previousSelected = -1;
let selectOrientation = "horizontal";

function loadLetters() {
	let stored = localStorage.getItem(data.metadata.id);

	if (stored != null) {
		stored = JSON.parse(stored);

		for (const [key, value] of Object.entries(stored)) {
			if (value == ".") {
				document.getElementById("tile" + key.substring(10).toString()).classList.add("none");
			} else {
				document.getElementById(key).value = value;
			};
		};
	};
};

function saveLetters() {
	let stored = {};

	let inputs = document.querySelectorAll(".grid input");
	[].forEach.call(inputs, function(el) {
		if (document.getElementById("tile" + el.id.substring(10).toString()).classList.contains("none")) {
			stored[el.id] = ".";
		} else {
			stored[el.id] = el.value;
		};
	});

	localStorage.setItem(data.metadata.id, JSON.stringify(stored));
};

function storeClues() {
	let clues = {};

	const clueInputs = document.querySelectorAll('.clues input');
	clueInputs.forEach(input => {
		clues[input.attributes.word.value] = input.value;
	});

	window.localStorage.setItem(data.metadata.id + "_clues", JSON.stringify(clues));
};

function populateGrid() {
	for (let y = 0; y < data.puzzle.size.y; y++) {
		for (let x = 0; x < data.puzzle.size.x; x++) {
			let tileNumber = y * data.puzzle.size.y + x;
			createInput(tileNumber, " ")
		};
	};
}

function createGrid() {
	let grid = document.getElementById("grid");

	for (let y = 0; y < data.puzzle.size.y; y++) {
		let row = document.createElement("div");
		row.id = "row" + y.toString();
		row.classList.add("row");

		for (let x = 0; x < data.puzzle.size.x; x++) {
			let tileNumber = y * data.puzzle.size.y + x;

			let tile = document.createElement("div");
			tile.id = "tile" + tileNumber.toString();
			tile.classList.add("tile");

			row.appendChild(tile);
		};

		grid.appendChild(row);
	};
}

function onTileClick(e) {
	document.getElementById("keyboard").style.display = "flex";

	let tileNumber = e.target.attributes.tilenumber.value;
	if (tileNumber == previousSelected) {
		selectOrientation = selectOrientation == "horizontal" ? "vertical" : "horizontal";
	};
	previousSelected = tileNumber;

	highlightWord();
};

function onTileInput(event) {
	let tileNumber = previousSelected;
	let x = tileNumber % data.puzzle.size.x;
	let y = Math.floor(tileNumber / data.puzzle.size.y);

	switch(event.key) {
		case 'Tab':
			break;
		case 'Enter':
			event.preventDefault();
			break;
		case 'Backspace':
			event.preventDefault();
			event.target.value = "";

			// Go to previous tile
			if (selectOrientation == "horizontal") {
				if (x > 0) {
					x -= 1;
				} else {
					if (y > 0) {
						x = data.puzzle.size.x - 1;
						y -= 1;
					} else {
						x = data.puzzle.size.x - 1;
						y = data.puzzle.size.y - 1;
					};
				};
			} else {
				if (y > 0) {
					y -= 1;
				} else {
					if (x > 0) {
						y = data.puzzle.size.y - 1;
						x -= 1;
					} else {
						x = data.puzzle.size.x - 1;
						y = data.puzzle.size.y - 1;
					};
				};
			};
			
			previousSelected = x + y * data.puzzle.size.y;

			break;
		case 'ArrowUp':
			if (selectOrientation == "vertical") {
				if (y > 0) {
					y -= 1;
				};
				previousSelected = x + y * data.puzzle.size.y;
			} else {
				selectOrientation = "vertical";
			};
			break;
		case 'ArrowDown':
			if (selectOrientation == "vertical") {
				if (y < 4) {
					y += 1;
				};
				previousSelected = x + y * data.puzzle.size.y;
			} else {
				selectOrientation = "vertical";
			};
			break;
		case 'ArrowLeft':
			if (selectOrientation == "horizontal") {
				if (x > 0) {
					x -= 1;
				};
				previousSelected = x + y * data.puzzle.size.y;
			} else {
				selectOrientation = "horizontal";
			};
			break;
		case 'ArrowRight':
			if (selectOrientation == "horizontal") {
				if (x < 4) {
					x += 1;
				};
				previousSelected = x + y * data.puzzle.size.y;
			} else {
				selectOrientation = "horizontal";
			};
			break;
		default:
			event.preventDefault();

			let tile = document.getElementById("tile" + event.target.attributes.tilenumber.value);
			// Check if key is letter and skip black squares
			if (
				!tile.classList.contains("none") 
				&& 
				"abcdefghijklmnopqrstuvwxyz".indexOf(event.key) >= 0
			) {
				// Set input value to key
				event.target.value = event.key;
			} else if (event.key == ".") {
				tile.classList.toggle("none");
			};

			createClues();
			saveLetters();
			nextTile();
			return;
	};

	focusInput();
	highlightWord();
};

function nextTile() {
	let x = previousSelected % data.puzzle.size.x;
	let y = Math.floor(previousSelected / data.puzzle.size.y);

	if (selectOrientation == "horizontal") {
		if (x < data.puzzle.size.x - 1) {
			x += 1;
		} else {
			if (y < data.puzzle.size.y - 1) {
				x = 0;
				y += 1;
			} else {
				x = 0;
				y = 0;
			};
		};
	} else {
		if (y < data.puzzle.size.y - 1) {
			y += 1;
		} else {
			if (x < data.puzzle.size.x - 1) {
				y = 0;
				x += 1;
			} else {
				x = 0;
				y = 0;
			};
		};
	};

	previousSelected = x + y * data.puzzle.size.y;

	focusInput();
	highlightWord();
};

function highlightWord() {
	let highlighteds = document.querySelectorAll(".highlighted");
	[].forEach.call(highlighteds, function(el) {
		el.classList.remove("highlighted");
	});

	let x = previousSelected % data.puzzle.size.x;
	let y = Math.floor(previousSelected / data.puzzle.size.y);

	if (selectOrientation == "horizontal") {
		for (let i = x; i < data.puzzle.size.x; i++) {
			let tileNumber = i + y * data.puzzle.size.y;

			let tile = document.getElementById("tile" + tileNumber.toString());
			if (tile.classList.contains("none")) {
				break;
			}
			tile.classList.add("highlighted");
		};
		for (let i = x; i >= 0; i--) {
			let tileNumber = i + y * data.puzzle.size.y;
			
			let tile = document.getElementById("tile" + tileNumber.toString());
			if (tile.classList.contains("none")) {
				break;
			};
			tile.classList.add("highlighted");
		};
	} else {
		for (let i = y; i < data.puzzle.size.y; i++) {
			let tileNumber = x + i * data.puzzle.size.y;
			
			let tile = document.getElementById("tile" + tileNumber.toString());
			if (tile.classList.contains("none")) {
				break;
			};
			tile.classList.add("highlighted");
		};
		for (let i = y; i >= 0; i--) {
			let tileNumber = x + i * data.puzzle.size.y;
			
			let tile = document.getElementById("tile" + tileNumber.toString());
			if (tile.classList.contains("none")) {
				break;
			};
			tile.classList.add("highlighted");
		};
	};
};

function initialisePuzzle() {
	createGrid();
	populateGrid();

	loadLetters();
	createClues();

	const inputs = document.querySelectorAll('.grid input');
	inputs.forEach(input => {
		input.addEventListener('click', onTileClick);
		input.addEventListener('keydown', onTileInput);
	});
};

initialisePuzzle();

function parsePuzzle() {
	let puzzle = {
		size: data.puzzle.size,
		horizontal: [],
		vertical: []
	};

	let n = 1;

	// Get first tile (by tileNumber (so from top left to bottom right))
	for (let i = 0; i < (data.puzzle.size.x * data.puzzle.size.y); i++) {
		// Skip none tiles
		if (document.getElementById("tile" + i.toString()).classList.contains("none")) {
			continue;
		};

		// Get down word
		let word = "";
		let x = i % data.puzzle.size.x;
		let y = Math.floor(i / data.puzzle.size.y);

		// check if already in another down word
		let collision = false;
		for (let w of puzzle.vertical) {
			if (x == w.x && y - w.y <= w.word.length) {
				collision = true;
				break;
			};
		};
		if (collision) continue;

		// Get letters of word
		for (let j = y; j < data.puzzle.size.y; j++) {
			let tileNumber = x + j * data.puzzle.size.y;
			let tileLetter = document.getElementById("tileLetter" + tileNumber.toString());

			// on none tile, stop and add word
			if (document.getElementById("tile" + tileNumber.toString()).classList.contains("none")) {
				break;
			};

			// if square is empty break and set word to null
			if (tileLetter.value == "") {
				word = "";
				break;
			};

			// get letter of current tile and add to word
			word += tileLetter.value;
		};

		if (word.length > 1) {
			// push word  to puzzle json
			puzzle.vertical.push({
				x: x,
				y: y,
				n: n,
				word: word
			});
	
			// increment word number
			n += 1;
		};
	};

	// Get horizontal words
	for (let i = 0; i < (data.puzzle.size.x * data.puzzle.size.y); i++) {
		// Skip none tiles
		if (document.getElementById("tile" + i.toString()).classList.contains("none")) {
			continue;
		};

		// Get down word
		let word = "";
		let x = i % data.puzzle.size.x;
		let y = Math.floor(i / data.puzzle.size.y);

		// check if already in another down word
		let collision = false;
		for (let w of puzzle.horizontal) {
			if (y == w.y && x - w.x <= w.word.length) {
				collision = true;
				break;
			};
		};
		if (collision) continue;

		// Get letters of word
		for (let j = x; j < data.puzzle.size.x; j++) {
			let tileNumber = j + y * data.puzzle.size.y;
			let tileLetter = document.getElementById("tileLetter" + tileNumber.toString());

			// on none tile, stop and add word
			if (document.getElementById("tile" + tileNumber.toString()).classList.contains("none")) {
				break;
			};

			// if square is empty break and set word to null
			if (tileLetter.value == "") {
				word = "";
				break;
			};

			// get letter of current tile and add to word
			word += tileLetter.value;
		};

		if (word.length > 1) {
			// Check if the down word already has a number
			let hN = n;
			for (let w of puzzle.vertical) {
				if (y == w.y && x == w.x) {
					hN = w.n;
					break;
				};
			};
			
			// push word  to puzzle json
			puzzle.horizontal.push({
				x: x,
				y: y,
				n: hN,
				word: word
			});
	
			// increment word number
			if (hN == n) {
				n += 1;
			};
		};
	};
	
	return puzzle;
};

function createClue(w, direction, list, clues) {
	let clue = document.createElement("div");
	clue.classList.add("clue-add");

	let number = document.createElement("div");
	number.innerHTML = w.n.toString() + ".";
	number.classList.add("clue-number")

	let word = document.createElement("div");
	word.innerHTML = w.word.toUpperCase();
	
	let clueText = document.createElement("div");
	clueText.classList.add("input")
	let clueInput = document.createElement("input");
	clueInput.setAttribute("word", w.word.toUpperCase());
	clueInput.setAttribute("direction", direction);
	clueInput.setAttribute("number", w.n.toString());
	clueInput.value = clues[w.word.toUpperCase()] != undefined ? clues[w.word.toUpperCase()] : "";
	clueText.appendChild(clueInput);

	clue.appendChild(number);
	clue.appendChild(word);
	clue.appendChild(clueText);

	list.appendChild(clue);
};

function createClues() {
	let verticalClues = document.getElementById("vertical-clues")
	let horizontalClues = document.getElementById("horizontal-clues")
	let puzzle = parsePuzzle();

	let clues = window.localStorage.getItem(data.metadata.id + "_clues") != null ? JSON.parse(window.localStorage.getItem(data.metadata.id + "_clues")) : {};

	verticalClues.innerHTML = "";
	horizontalClues.innerHTML = "";

	for (let v of puzzle.vertical) {
		createClue(v, "vertical", verticalClues, clues);
	};

	for (let h of puzzle.horizontal) {
		createClue(h, "horizontal", horizontalClues, clues);
	};

	const clueInputs = document.querySelectorAll('.clues input');
	clueInputs.forEach(input => {
		input.addEventListener('focus', () => {
			document.getElementById("keyboard").style.display = "none";
		});
		input.addEventListener('keyup', storeClues);
	});
};

function getClues(puzzle) {
	let inputs = document.querySelectorAll(".clue-add-container input");
	[].forEach.call(inputs, function(input) {
		let direction = input.attributes.direction.value;
		let number = parseInt(input.attributes.number.value);

		[].forEach.call(puzzle[direction], function(word) {
			if (word.n == number) {
				word.clue = input.value;
			};
		});
	});

	return puzzle;
};

function validatePuzzle() {
	// Check if puzzle has filled out all squares
	let valid = true;

	let tiles = document.querySelectorAll(".grid input");
	[].forEach.call(tiles, function(tile) {
		let tileNumber = tile.attributes.tilenumber.value;

		if (
			(tile.value.toLowerCase() == "")
			&&
			(!document.getElementById("tile" + tileNumber.toString()).classList.contains("none")) 
		) valid = false;
	});

	// Check if puzzle has filled out all clues
	let inputs = document.querySelectorAll(".clue-add-container input");
	[].forEach.call(inputs, function(input) {
		if (input.value == "") valid = false;
	});

	return valid;
};

function gameAddPuzzle() {
	let puzzle = parsePuzzle();
	puzzle = getClues(puzzle);

	return puzzle;
};