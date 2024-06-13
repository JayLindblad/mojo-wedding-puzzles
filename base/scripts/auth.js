// Function to show the alert for email and password authentication
function showLoginAlert() {
	var email = prompt("Enter your email:");
	var password = prompt("Enter your password:");

	if (email && password) {
			// Sign in with email and password
			firebase.auth().signInWithEmailAndPassword(email, password)
			.then((userCredential) => {
				let user = userCredential.user;
				window.location.reload();
			})
			.catch((error) => {
				alert("Error signing in.");
				document.getElementById("signedin").innerHTML = "WARNING: Not signed in!"
			});
	} else {
		document.getElementById("signedin").innerHTML = "WARNING: Not signed in!"
		console.error("Email or password is empty.");
	}
}