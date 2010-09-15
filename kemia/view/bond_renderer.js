/** 
 * Copyright 2010 Paul Novak (paul@wingu.com)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 * limitations under the License.
 * @author paul@wingu.com (Paul Novak)
 */
goog.provide('kemia.view.BondRenderer');
goog.require('kemia.view.Renderer');
goog.require('kemia.math.Line');

/**
 * Class to render an bond object to a graphics representation
 * 
 *
 * @param {goog.graphics.AbstractGraphics} graphics to draw on.
 * @param {Object=} opt_config override default configuration
 * @constructor
 * @extends {kemia.view.Renderer}
 */
kemia.view.BondRenderer = function(graphics, opt_config ) {
	kemia.view.Renderer.call(
			this,
			graphics, 
			kemia.view.BondRenderer.defaultConfig, 
			opt_config);
}
goog.inherits(kemia.view.BondRenderer, kemia.view.Renderer);

/**
 * @param {kemia.model.Bond} bond
 * @param {string]} opt_color
 * @param {goog.graphics.Group=} opt_group
 */
kemia.view.BondRenderer.prototype.highlightOn = function(bond, opt_color, opt_group) {
	
	if(!opt_color){
		opt_color = this.config.get("highlight")['color'];
	}
	if (!opt_group) {
		opt_group = this.graphics.createGroup();
	}

	var strokeWidth = this.config.get("bond")['stroke']['width'] * 2;
	var stroke = new goog.graphics.Stroke(strokeWidth, opt_color);
	var fill = null;
	var radius = this.config.get("highlight")['radius']
			* this.transform.getScaleX();
	var theta = -kemia.view.BondRenderer.getTheta(bond) * 180 / Math.PI;
	var angle = theta + 90;

	var arcExtent;
	if (theta <= 0) {
		arcExtent = (bond.source.coord.y <= bond.target.coord.y) ? 180 : -180;
	} else {
		arcExtent = (bond.source.coord.y > bond.target.coord.y) ? 180 : -180;
	}

	var coords = this.transform.transformCoords( [ bond.source.coord,
			bond.target.coord ]);

	var path = new goog.graphics.Path();
	path.arc(coords[0].x, coords[0].y, radius, radius, angle, arcExtent);
	path.arc(coords[1].x, coords[1].y, radius, radius, angle, -arcExtent);

	this.graphics.drawPath(path, stroke, fill, opt_group);
	return opt_group;
}

/**
 * 
 * @return{number} bond angle of elevation
 */
kemia.view.BondRenderer.getTheta = function(bond) {
	return new kemia.math.Line(bond.source.coord, bond.target.coord)
			.getTheta();
}


kemia.view.BondRenderer.hasSymbol = function(atom) {
    return (atom.symbol != "C" || atom.countBonds() == 1);
}


/**
 * A default configuration for renderer
 */
kemia.view.BondRenderer.defaultConfig = {
	'bond' : {
		'stroke' : {
			'width' : 2,
			'color' : 'black'
		},
		'fill' : {
			'color' : 'black'
		}
	},
	'highlight' : {
		'radius' : .3,
		'color' : 'blue'
	}
};



