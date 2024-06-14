let puzzles = [];

function getPuzzles() {
	db.collection(game)
	.orderBy("metadata.timestamp", "desc")
	.get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			let data = doc.data();
			data.metadata.id = doc.id;

			puzzles.push(data);
		});

		setupList();
	})
	.catch((error) => {
		alert("Error getting puzzle");
	});
}

function deletePuzzle(id) {
	db.collection(game).doc(id).delete().then(() => {
		window.location.reload();
	});
};

function setupList() {
	let list = document.getElementById("puzzle-list");
	list.innerHTML = "";

	puzzles.forEach(data => {
		let item = document.createElement("div");
		
		item.classList.add("item");
		item.id = data.metadata.id;
		item.innerHTML = 
			"<span class='bold'><a href='/" + game + "/play.html?number=" + data.metadata.id + "'>#" + 
			data.metadata.id + 
			"</a></span><span>" + 
			data.metadata.author + 
			"</span><span>" + 
			new Date(data.metadata.timestamp).toLocaleString('de-DE', {year: 'numeric', month: '2-digit', day:'2-digit'}) + 
			"</span>"
		;

		if (firebase.auth().currentUser != null) {
			item.innerHTML +=
			`<button class="trash-button" onclick='deletePuzzle("${data.metadata.id}")'>` +
			'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="white">' +
            '<path d="M3 6h18v2H3zm2 2h14v12a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm5-4V2h4v2h5v2H3V4h5zm2 4h2v10h-2zm4 0h2v10h-2zm-8 0h2v10H8z"/>' +
        	'</svg>' +
			`</button>`;
		};

		list.appendChild(item);
	});
};

getPuzzles();