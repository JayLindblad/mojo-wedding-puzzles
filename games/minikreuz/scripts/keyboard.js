function clickVirtualKeyboard(key) {
	let event = {
		target: document.getElementById("tileLetter" + previousSelected.toString()),
		key: key,
		preventDefault: () => {}
	};

	onTileInput(event);
};