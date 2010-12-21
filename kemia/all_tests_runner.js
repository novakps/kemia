goog.require('goog.testing.MultiTestRunner');



function setFilterFunction(testRunner) {
	var filterInput = document.getElementById('filter');
	var matchValue = filterInput.value || '';
	testRunner.setFilterFunction(function(testPath) {
		return testPath.indexOf(matchValue) > -1;
	});
}

function pageInit() {
	
	var hidePassesInput = document.getElementById('hidepasses');
	var parallelInput = document.getElementById('parallel');
	var filterInput = document.getElementById('filter');
	
	// Create a test runner and render it.
	var testRunner = new goog.testing.MultiTestRunner().setName(document.title)
			.setBasePath('./').setPoolSize(parallelInput.checked ? 8 : 1)
			.setStatsBucketSizes(5, 500).setHidePasses(hidePassesInput.checked)
			// .setVerbosePasses(true)
			.addTests(_allTests);
	testRunner.render(document.getElementById('runner'));

	goog.events.listen(hidePassesInput, 'click', function(e) {
		testRunner.setHidePasses(e.target.checked);
	});

	goog.events.listen(parallelInput, 'click', function(e) {
		testRunner.setPoolSize(e.target.checked ? 8 : 1);
	});

	goog.events.listen(filterInput, 'keyup', setFilterFunction);
	setFilterFunction(testRunner);
}

(function() {
	window.onload = function() {
		pageInit();
		window.onload = null;
	};
})()