function showPopup(id) {
	// Show popup
	let w = document.getElementById(id);
	w.classList.add("popup-open");
	let toBlur = document.getElementsByClassName("to-blur");
	for (let i = 0; i < toBlur.length; i++) {
		toBlur.item(i).classList.add("blurred");
	}
}

function closePopup(id) {
	console.log(id)
	let el = document.getElementById(id);
	el.classList.remove("popup-open");
	let toBlur = document.querySelectorAll(".to-blur");
	for (let i = 0; i < toBlur.length; i++) {
		toBlur.item(i).classList.remove("blurred");
	}
}