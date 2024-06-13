function metadataSetup(metadata) {
	let author = document.getElementById("author");
	author.innerHTML = "by " + metadata.author;
	let date = document.getElementById("date");
	date.innerHTML = new Date(metadata.timestamp).toLocaleString('de-DE', {year: 'numeric', month: '2-digit', day:'2-digit'});
};

async function getMostRecentPuzzle() {
	let puzzle = {};

	await db.collection(game).orderBy("metadata.timestamp", "desc").limit(1).get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			window.history.pushState({}, document.title, window.location.pathname + "?number=" + doc.id);
			puzzle = doc.data();
			puzzle.metadata.id = doc.id;
		});
	});

	return puzzle;
};

async function puzzleLoadEvent() {
	// Get puzzle number
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	// load data
	let puzzleNumber = urlParams.has('number') ? urlParams.get('number') : "";
	let puzzleData = {};

	if (puzzleNumber != "") {
		puzzleData = await db.collection(game).doc(puzzleNumber).get()
		.then(async (doc) => {
			let data = {};

			if (doc.exists) {
				data = await doc.data();
				data.metadata.id = doc.id;
			} else {
				data = await getMostRecentPuzzle();
			};

			return data;
		});
	} else {
		puzzleData = await getMostRecentPuzzle();
	};

	metadataSetup(puzzleData.metadata);

	return puzzleData;
};

function puzzleEndEvent(id, success, mistakes, history) {
	let stats = {
		id: id,
		userId: userId,
		timestamp: Date.now(),
		game: game,
		success: success,
		mistakes: mistakes,
		history: history
	};

	try {	
		analytics.logEvent('end', stats);
		db.collection("log").add(stats);
	
		// Log to logsnag
		let data = {
			"project": "verbindungen",
			"channel": "puzzles",
			"event": "finished",
			"description": stats.success ? "A user solved a puzzle." : "A user failed a puzzle.",
			"icon": stats.success ? "✅" : "❌",
			"notify": true,
			"tags": {
				"game": game,
				"id": stats.id,
				"success": stats.success,
				"mistakes": stats.mistakes
			}
		};
		fetch("https://api.logsnag.com/v1/log", {
			method: 'POST', // Specify the HTTP method
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${keys.logsnag}`
			},
			body: JSON.stringify(data), // Convert the JSON data to a string
		});
	} catch (e) {
		console.log("Error while logging stats: ", e)
	};
};