goog.require('kemia.model.Arrow');
goog.require('goog.testing.jsunit');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');


function setUp() {
	c = new goog.debug.Console();
	c.setCapturing(true);
	logger = goog.debug.Logger.getLogger('ArrowTest');
}

function testGetOrientation() {
	var arrow = new kemia.model.Arrow(
			new goog.math.Coordinate(0, 0),
			new goog.math.Coordinate(1, 0));
	var product_center = new goog.math.Coordinate(2, 0);
	assertEquals(kemia.model.Arrow.ORIENTATION.AHEAD, arrow
			.getOrientation(product_center));
	var reactant_center = new goog.math.Coordinate(-2, 0);
	assertEquals(kemia.model.Arrow.ORIENTATION.BEHIND, arrow.getOrientation(reactant_center));
}