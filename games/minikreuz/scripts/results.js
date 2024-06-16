function getResults() {
	// Convert milliseconds to different units
	const msInSecond = 1000;
	const msInMinute = msInSecond * 60;
	const msInHour = msInMinute * 60;
	const minutes = Math.floor((gameState.timeDiff % msInHour) / msInMinute).toString();
	const seconds = Math.floor((gameState.timeDiff % msInMinute) / msInSecond).toString();

	return `${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
};

function copyResults() {
	let text = "Mini Kreuzworträtsel Puzzle: #" + data.metadata.id + "\n";
	text += `Ausgefüllt in ${getResults()}\n`
	text += window.location.hostname + "/" + game + "/play.html?number=" + data.metadata.id;

	copyTextToClipboard(text);
};