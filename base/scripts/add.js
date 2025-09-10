function addPuzzle() {
	if (!validatePuzzle()) {
		return;
	};
	if (firebase.auth().currentUser == null) {
		return;
	};
	if (document.getElementById("author").value == "") {
		return;
	};

	let puzzle = gameAddPuzzle();
	let timestamp = Date.now();

	db.collection(game).add({
		metadata: {
			author: document.getElementById("author").value,
			timestamp: timestamp,
			game: game
		},
		puzzle: puzzle
	})
	.then((docRef) => {
		alert("Successfully added puzzle");

		// Log to logsnag
		let data = {
			"project": "connections",
			"channel": "puzzles",
			"event": "add",
			"description": "A user added a puzzle to the site.",
			"icon": "➕",
			"user_id": document.getElementById("author").value,
			"notify": true,
			"tags": {
				"game": game,
				"id": docRef.id
			}
		};
		fetch("https://api.logsnag.com/v1/log", {
			method: 'POST', // Specify the HTTP method
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${keys.logsnag}`
			},
			body: JSON.stringify(data), // Convert the JSON data to a string
		})
		.then(_ => {
			window.location.replace("/");
		});		
	})
	.catch((error) => {
		alert("Error adding puzzle");
	});
}
