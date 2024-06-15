function loadLetters() {
	let stored = localStorage.getItem(data.metadata.id);

	if (stored != null) {
		stored = JSON.parse(stored);

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

	localStorage.setItem(data.metadata.id, JSON.stringify(stored));
};

function clearLetters() {
	let inputs = document.querySelectorAll("input");
	[].forEach.call(inputs, function(el) {
		el.value = "";
	});
	
	window.localStorage.removeItem(data.metadata.id);
};

function loadState() {
	// Get timer start
	timeDiff = localStorage.getItem(data.metadata.id + "_diff") == null ? 0 : localStorage.getItem(data.metadata.id + "_diff");
	ended = localStorage.getItem(data.metadata.id + "_ended") == null ? ended : localStorage.getItem(data.metadata.id + "_ended");
	
	if (ended == true) {
		gameEnd(false);
	};
};

function resetState() {
	timeDiff = 0;
	localStorage.setItem(data.metadata.id + "_diff", timeDiff);
	
	localStorage.setItem(data.metadata.id + "_ended", ended);
	localStorage.remove(data.metadata.id);
}