	goog.require('kemia.view.PlusRenderer');
	goog.require('kemia.model.Plus');
	goog.require('goog.events.EventType');
	goog.require('goog.dom');
	goog.require('goog.graphics');
	goog.require('kemia.graphics.AffineTransform');

    
function initPage(){
	var element = goog.dom.getElement('container')
	var graphics = goog.graphics.createGraphics(element.clientWidth,
			element.clientHeight);
	graphics.render(element);
	var pr = new kemia.view.PlusRenderer(graphics);
	var trans = new kemia.graphics.AffineTransform(30,0,0,30,0,0);
	pr.render(new kemia.model.Plus(new goog.math.Coordinate(2,2)), trans);
	var plus = new kemia.model.Plus(new goog.math.Coordinate(2, 5));
	pr.render(plus, trans);
	pr.highlightOn(plus);
};

goog.events.listen(window, goog.events.EventType.LOAD, initPage);