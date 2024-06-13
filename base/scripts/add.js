document.addEventListener('DOMContentLoaded', (event) => {
	const inputs = document.querySelectorAll('input');
	const button = document.getElementById('send');

	function checkInputs() {
		let allFilled = true;
		inputs.forEach(input => {
			if (input.value === '') {
				allFilled = false;
			}
		});

		if (allFilled) {
			button.classList.add("active");
		} else {
			button.classList.remove("active");
		}
	}

	inputs.forEach(input => {
		input.addEventListener('input', checkInputs);
	});
});

function addPuzzle() {
	const button = document.getElementById('send');
	if (!button.classList.contains("active")) {
		return;
	};
	if (firebase.auth().currentUser == null) {
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
			"project": "verbindungen",
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