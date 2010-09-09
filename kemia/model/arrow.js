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
 * @fileoverview class to describe an arrow in a reaction
 * @author paul@wingu (Paul Novak)
 */

goog.provide('kemia.model.Arrow');
/**
 * @param {goog.math.Coordinate=} opt_source source point coordinates for arrow
 * @param {goog.math.Coordinate=} opt_target target point coordinates for arrow
 * @param {kemia.model.Arrow.STYLE=} opt_style
 * @constructor
 */
kemia.model.Arrow = function(opt_source, opt_target, opt_style) {
	this.source = goog.isDef(opt_source) ? 
			opt_source : 
			new goog.math.Coordinate(0, 0);
	this.target = goog.isDef(opt_target) ? 
			opt_target 
			: goog.math.Coordinate.sum(this.source, new goog.math.Coordinate(0, 1));
	this.style = goog.isDef(opt_style) ? 
			opt_style: 
			kemia.model.Arrow.STYLES.FORWARD;
};

/**
 * @enum {number}
 */
kemia.model.Arrow.STYLES = {
	FORWARD : 1,
	BACKWARD : 2,
	BIDIRECTIONAL : 3
}