/**
 * Copyright 2010 Paul Novak (paul@wingu.com)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 * 
 */
goog.provide('kemia.view.DoubleBondRenderer');
goog.require('kemia.view.BondRenderer');

/**
 * Class to render an double bond object to a graphics representation
 * 
 * 
 * @param {goog.graphics.AbstractGraphics}
 *            graphics to draw on.
 * @param {Object=}
 *            opt_config override default configuration
 * @constructor
 * @extends {kemia.view.BondRenderer}
 */
kemia.view.DoubleBondRenderer = function(graphics, opt_config) {
	kemia.view.BondRenderer.call(this, graphics,
			kemia.view.DoubleBondRenderer.defaultConfig, opt_config);
}
goog.inherits(kemia.view.DoubleBondRenderer, kemia.view.BondRenderer);

function triangleSign(a, b, c) {
	return (a.x - c.x) * (b.y - c.y) - (a.y - c.y) * (b.x - c.x);
}

function isOnSameSide(bond, p1, p2) {
	return (triangleSign(bond.source.coord, bond.target.coord, p1)
			* triangleSign(bond.source.coord, bond.target.coord, p2) > 0);
}
/**
 * tests if two points are on the same side of a line returns: false if both
 * points are on same side true if both points are on opposite sides. or if at
 * least one is on the line
 * 
 * @param {goog.math.Vec2}
 *            p1 first point
 * @param {goog.math.Vec2}
 *            p2 second point
 * @param {goog.math.Vec2}
 *            p_line a point on the line
 * @param {goog.math.Vec2}
 *            normalized line vector
 * @return {boolean}
 */
kemia.view.DoubleBondRenderer.pointsOnSameSideOfLine = function (p1, p2, p_line, normal){
	return goog.math.Vec2.dot(normal, goog.math.Vec2.difference(p1, p_line)) * goog.math.Vec2.dot(normal, goog.math.Vec2.difference(p2, p_line)) > 0;
}


kemia.view.DoubleBondRenderer.prototype.render = function(bond, transform,
		bondPath) {

	this.setTransform(transform);

	var ring = kemia.view.DoubleBondRenderer.getFirstRing(bond);

	if (ring) {
		// create the bondvector
		var bv = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.difference(
				bond.target.coord, bond.source.coord));
		var bondLength = bv.magnitude();
		var bondWidth = bondLength / 6;
		bv.scale(1 / bondLength * bondWidth);
		// create a vector orthogonal to the bond vector
		var orthogonal = new goog.math.Vec2(-bv.y, bv.x);
		var normal = bv.clone().normalize();
		var point_on_bond = goog.math.Vec2.fromCoordinate(bond.source.coord);
		var center = goog.math.Vec2.fromCoordinate(ring.getRingCenter());
		// check the side, invert orthogonal if needed
		var side = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.sum(bond.source.coord, orthogonal));


		if (!kemia.view.DoubleBondRenderer.pointsOnSameSideOfLine(center, side, point_on_bond, normal)) {
			orthogonal.invert();
		}

		var side = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.sum(bond.source.coord, orthogonal));
		//goog.asserts.assert(goog.math.Vec2.distance(center, side) < goog.math.Vec2.distance(center, point_on_bond),'double bond side should be closer to center than bond point');

		// the inner line coords
		var coord1 = goog.math.Coordinate.sum(bond.source.coord, orthogonal);
		var coord2 = goog.math.Coordinate.sum(bond.target.coord, orthogonal);
		var coord3 = bond.source.coord;
		var coord4 = bond.target.coord;

		// adjust for symbols if needed
		if (kemia.view.BondRenderer.hasSymbol(bond.source)) {
			var space = bv.clone();
			space.normalize();
			space.scale(0.2);
			coord1 = goog.math.Coordinate.sum(coord1, space);
			coord3 = goog.math.Coordinate.sum(coord3, space)
		} else {
			coord1 = goog.math.Coordinate.sum(coord1, bv);
		}
		if (kemia.view.BondRenderer.hasSymbol(bond.target)) {
			var space = bv.clone();
			space.normalize();
			space.scale(0.2);
			coord2 = goog.math.Coordinate.difference(coord2, space);
			coord4 = goog.math.Coordinate.difference(coord4, space)
		} else {
			coord2 = goog.math.Coordinate.difference(coord2, bv);
		}

		var coords = transform.transformCoords( [ coord1, coord2, coord3,
				coord4 ]);

		bondPath.moveTo(coords[0].x, coords[0].y);
		bondPath.lineTo(coords[1].x, coords[1].y);
		bondPath.moveTo(coords[2].x, coords[2].y);
		bondPath.lineTo(coords[3].x, coords[3].y);
	} else {
		// create the bondvector
		var bv = goog.math.Vec2.fromCoordinate(goog.math.Coordinate.difference(
				bond.target.coord, bond.source.coord));
		var bondLength = bv.magnitude();
		var bondWidth = bondLength / 12;
		bv.scale(1 / bondLength * bondWidth);
		// create a vector orthogonal to the bond vector
		var orthogonal = new goog.math.Vec2(bv.y, -bv.x);

		var coord1 = goog.math.Coordinate.sum(bond.source.coord, orthogonal);
		var coord2 = goog.math.Coordinate.sum(bond.target.coord, orthogonal);
		var coord3 = goog.math.Coordinate.difference(bond.source.coord,
				orthogonal);
		var coord4 = goog.math.Coordinate.difference(bond.target.coord,
				orthogonal);

		// adjust for symbols if needed
		if (kemia.view.BondRenderer.hasSymbol(bond.source)) {
			var space = bv.clone();
			space.normalize();
			space.scale(0.2);
			coord1 = goog.math.Coordinate.sum(coord1, space);
			coord3 = goog.math.Coordinate.sum(coord3, space)
		}
		if (kemia.view.BondRenderer.hasSymbol(bond.target)) {
			var space = bv.clone();
			space.normalize();
			space.scale(0.2);
			coord2 = goog.math.Coordinate.difference(coord2, space);
			coord4 = goog.math.Coordinate.difference(coord4, space)
		}

		var coords = transform.transformCoords( [ coord1, coord2, coord3,
				coord4 ]);

		bondPath.moveTo(coords[0].x, coords[0].y);
		bondPath.lineTo(coords[1].x, coords[1].y);
		bondPath.moveTo(coords[2].x, coords[2].y);
		bondPath.lineTo(coords[3].x, coords[3].y);
	}

};

/**
 * 
 * @return{kemia.ring.Ring} first ring that contains this bond
 */
kemia.view.DoubleBondRenderer.getFirstRing = function(bond) {
	return goog.array.find(bond.molecule.getRings(), function(ring) {
		return goog.array.contains(ring.bonds, this);
	}, bond);
}
