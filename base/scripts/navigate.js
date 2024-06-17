function backwards(game) {
	// Get next document
	db.collection(game).where("metadata.timestamp", "<", data.metadata.timestamp)
	.orderBy("metadata.timestamp", "desc")
	.limit(1)
	.get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			if (!doc.exists) return;

			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
		
			// Change number
			urlParams.set('number', doc.id)
		
			const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		
			// Reload the page with the new URL
			window.location.href = newUrl;
		});
	})
	.catch((error) => {
		alert("Error getting puzzle");
	});
}

function forwards(game) {
	// Get next document
	db.collection(game).where("metadata.timestamp", ">", data.metadata.timestamp)
	.orderBy("metadata.timestamp")
	.limit(1)
	.get()
	.then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			if (!doc.exists) return;
			
			const queryString = window.location.search;
			const urlParams = new URLSearchParams(queryString);
		
			// Change number
			urlParams.set('number', doc.id)
		
			const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		
			// Reload the page with the new URL
			window.location.href = newUrl;
		});
	})
	.catch((error) => {
		alert("Error getting puzzle");
	});
}