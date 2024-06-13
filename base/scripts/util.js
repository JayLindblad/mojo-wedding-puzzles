function copyTextToClipboard(text) {
	// Check if the Clipboard API is supported
	if (navigator.clipboard) {
		// Use the Clipboard API
		navigator.clipboard.writeText(text)
	} else {
		// Fallback for browsers that don't support the Clipboard API
		const textArea = document.createElement('textarea');
		textArea.value = text;

		// Make the textarea invisible
		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			// Execute the copy command
			document.execCommand('copy');
		} catch (error) {
		}

		// Clean up
		document.body.removeChild(textArea);
	};
};