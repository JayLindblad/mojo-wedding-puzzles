function forward() {
	let word = getWord(previousSelected, selectOrientation);
	word = nextWord(word, true);
	highlightWord(word);
	focusInput();
};

function backward() {
	let word = getWord(previousSelected, selectOrientation);
	word = nextWord(word, false);
	highlightWord(word);
	focusInput();
};