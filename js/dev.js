$(function() {
	// Include error handling and other stuff that's ripped away
	// from the minified version.
	DEBUG = true;

	// Load shaders asynchronously because if we use 'src' tag our script
	// won't be able to access the text directly in a similar manner
	// than in the minified version. This way will make the dev version
	// look similar to the minified.

	var vReady = false;
	var fReady = false;

	var initialize = function() {
		if (vReady && fReady) {	
	        $.getScript("js/main.js");
		}
	}

	$.get("shader/vertex.glsl", function(data) {
		$("#v").text(data);
		vReady = true;
		initialize();
	});

	$.get("shader/fragment.glsl", function(data) {
		$("#f").text(data);
		fReady = true;
		initialize();
	});
});