goog.provide("kemia.graphics.ElementArray");
goog.require('goog.array');
goog.require("goog.debug.Logger");

/**
 * convenience class to contain group of goog.graphics.Elements since nested vml groups do not seem to work for IE8 in standards mode
 * 
 * @constructor
 */
kemia.graphics.ElementArray = function() {
    /** @type{Array.<goog.graphics.Element>}
     * @private
	 */
    this._elements = [];
}

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.graphics.ElementArray.prototype.logger = goog.debug.Logger
		.getLogger('kemia.graphics.ElementArray');

/**
 * add a graphics element
 * @param {goog.graphics.Element} element the element to add
 */
kemia.graphics.ElementArray.prototype.add = function(element) {
    this._elements.push(element);
}

/** 
 * remove all elements
 */
kemia.graphics.ElementArray.prototype.clear = function() {
	goog.array.forEach(this._elements, function(element){
		element.getGraphics().removeElement(element);
	}, this);
	this._elements.length=0;
}


