
goog.require('kemia.model.Arrow');
goog.require('goog.dom');
goog.require('goog.graphics');
goog.require('kemia.view.ArrowRenderer');
goog.require('kemia.graphics.AffineTransform');
goog.require('goog.math.Coordinate');
goog.require('goog.events');
goog.require('goog.events.EventType');

function initPage(){
	var element = goog.dom.getElement('container')
	var graphics = goog.graphics.createGraphics(element.clientWidth,
			element.clientHeight);
	graphics.render(element);
	var pr = new kemia.view.ArrowRenderer( graphics);
	var trans = new kemia.graphics.AffineTransform(30,0,0,-30,0,0);
	pr.render(new kemia.model.Arrow(new goog.math.Coordinate(6, -4), new goog.math.Coordinate(10, -4), kemia.model.Arrow.STYLES.FORWARD, "chicken soup with rice", "really, really, really, hot"), trans);
	pr.render(new kemia.model.Arrow(new goog.math.Coordinate(10, -6), new goog.math.Coordinate(8, -8), kemia.model.Arrow.STYLES.FORWARD, "",""), trans);
	pr.render(new kemia.model.Arrow(new goog.math.Coordinate(8, -6), new goog.math.Coordinate(10, -8), kemia.model.Arrow.STYLES.FORWARD, "",""), trans);
	var a = new kemia.model.Arrow(new goog.math.Coordinate(1, -6), new goog.math.Coordinate(3, -9), kemia.model.Arrow.STYLES.FORWARD, "aaaaa","xxxxx")	;
	pr.render(a, trans);
	pr.highlightOn(a);
	pr.render(new kemia.model.Arrow(new goog.math.Coordinate(1, -3), new goog.math.Coordinate(3, 0), 				kemia.model.Arrow.STYLES.FORWARD,"some reagent","condition, conditions"), trans);
};

goog.events.listen(window, goog.events.EventType.LOAD, initPage);

