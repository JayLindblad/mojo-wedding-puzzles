function updateLocalStorage(property, value) {
	let storedData = JSON.parse(window.localStorage.getItem(data.metadata.id));
	storedData[property] = value;
	window.localStorage.setItem(data.metadata.id, JSON.stringify(storedData));
};

function loadState() {
	// Get timer start
	let loaded = window.localStorage.getItem(data.metadata.id);
	if (loaded != undefined) {
		gameState = JSON.parse(loaded);
		if (Object.keys(gameState.letters).length > 0) {
			gameState.letters = JSON.parse(gameState.letters);
		};
	} else {
		window.localStorage.setItem(data.metadata.id, JSON.stringify(gameState));
	};
	
	if (gameState.ended == true) {
		gameEnd(false);
	};
};

function loadLetters() {
	loadState();
	let stored = gameState.letters;

	if (Object.keys(gameState.letters).length) {
		for (const [key, value] of Object.entries(stored)) {
			document.getElementById(key).value = value;
		};
	};
};

function saveLetters() {
	let stored = {};

	let inputs = document.querySelectorAll(".grid input");
	[].forEach.call(inputs, function(el) {
		stored[el.id] = el.value;
	});

	updateLocalStorage("letters", JSON.stringify(stored));
};

function clearLetters() {
	let inputs = document.querySelectorAll("input");
	[].forEach.call(inputs, function(el) {
		el.value = "";
	});
	
	updateLocalStorage("letters", {});
};

function resetState() {
	gameState = {
		ended: false,
		timeDiff: 0,
		showedComplete: false,
		previousSelected: -1,
		selectOrientation: "horizontal",
		letters: {}
	};
	
	window.localStorage.setItem(data.metadata.id, JSON.stringify({
		ended: false,
		timeDiff: 0,
		showedComplete: false,
		previousSelected: -1,
		selectOrientation: "horizontal",
		letters: {}
	}));
};