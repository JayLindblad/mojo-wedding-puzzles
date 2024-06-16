function forward() {
	let word = getWord(gameState.previousSelected, gameState.selectOrientation);
	word = nextWord(word, true);
	highlightWord(word);
	focusInput();
};

function backward() {
	let word = getWord(gameState.previousSelected, gameState.selectOrientation);
	word = nextWord(word, false);
	highlightWord(word);
	focusInput();
};