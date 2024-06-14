function validatePuzzle() {
	let allFilled = true;
	inputs.forEach(input => {
		if (input.value === '') {
			allFilled = false;
		}
	});

	if (allFilled) {
		return true;
	} else {
		return false;
	};
};

function gameAddPuzzle() {
	let puzzle = {
		"straightforward": {
			"solved": false,
			"color": "rgb(249, 223, 109)",
			"category": document.getElementById("s-c").value, 
			"words": [
				document.getElementById("s-w1").value,
				document.getElementById("s-w2").value,
				document.getElementById("s-w3").value,
				document.getElementById("s-w4").value,
			]
		},
		"medium": {
			"solved": false,
			"color": "rgb(160, 195, 90)",
			"category": document.getElementById("m-c").value,
			"words": [
				document.getElementById("m-w1").value,
				document.getElementById("m-w2").value,
				document.getElementById("m-w3").value,
				document.getElementById("m-w4").value,
			]
		},
		"hard": {
			"solved": false,
			"color": "rgb(176, 196, 239)",
			"category": document.getElementById("h-c").value,
			"words": [
				document.getElementById("h-w1").value,
				document.getElementById("h-w2").value,
				document.getElementById("h-w3").value,
				document.getElementById("h-w4").value,
			]
		},
		"tricky": {
			"solved": false,
			"color": "rgb(186, 129, 197)",
			"category": document.getElementById("t-c").value, 
			"words": [
				document.getElementById("t-w1").value,
				document.getElementById("t-w2").value,
				document.getElementById("t-w3").value,
				document.getElementById("t-w4").value,
			]
		}
	};

	return puzzle;
}