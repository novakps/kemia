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
goog.provide('kemia.view.SingleUpOrDownBondRenderer');
goog.require('kemia.view.BondRenderer');

/**
 * Class to render an single up or down bond object to a graphics representation
 * 
 *
 * @param {goog.graphics.AbstractGraphics} graphics to draw on.
 * @param {Object=} opt_config override default configuration
 * @constructor
 * @extends {kemia.view.BondRenderer}
 */
kemia.view.SingleUpOrDownBondRenderer = function(graphics, opt_config) {
	kemia.view.BondRenderer.call(this, 
			graphics, 
			kemia.view.SingleUpOrDownBondRenderer.defaultConfig, 
			opt_config);
}
goog.inherits(kemia.view.SingleUpOrDownBondRenderer,
		kemia.view.BondRenderer);

kemia.view.SingleUpOrDownBondRenderer.prototype.render = function(bond,
		transform, path) {
	
	this.setTransform(transform);

	var width = this.config.get("bond")['stroke']['width'] / 10;
	var theta = kemia.view.BondRenderer.getTheta(bond);

	var angle_left = theta + (Math.PI / 2);
	var angle_right = theta - (Math.PI / 2);

	var transleft = new kemia.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_left)
			* width, Math.sin(angle_left) * width);

	var transright = new kemia.graphics.AffineTransform(1, 0, 0, 1, Math
			.cos(angle_right)
			* width, Math.sin(angle_right) * width);

	var leftside = transleft.transformCoords( [bond.source.coord, bond.target.coord]);
	var rightside = transright.transformCoords([bond.source.coord, bond.target.coord]);

	var coords = transform.transformCoords( [ leftside[0],
			leftside[1], rightside[0], rightside[1] ]);

	var stroke = new goog.graphics.Stroke(
			this.config.get("bond")['stroke']['width'], this.config.get("bond")['stroke']['color']);
	var fill = null;

	path.moveTo(coords[0].x, coords[0].y);
	for ( var j = 1, lines = 10; j < lines; j++) {
		if (j % 2) {
			path.lineTo(coords[0].x + (coords[1].x - coords[0].x) * j / lines,
					coords[0].y + (coords[1].y - coords[0].y) * j / lines);
		} else {
			path.lineTo(coords[2].x + (coords[3].x - coords[2].x) * j / lines,
					coords[2].y + (coords[3].y - coords[2].y) * j / lines);
		}
	}

}
