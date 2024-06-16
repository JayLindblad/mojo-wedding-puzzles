function clickVirtualKeyboard(key) {
	let event = {
		target: document.getElementById("tileLetter" + gameState.previousSelected.toString()),
		key: key,
		preventDefault: () => {}
	};

	onTileInput(event);
};