/**
 * @license Copyright 2010 Paul Novak (paul@wingu.com)
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
 * @author paul@wingu.com (Paul Novak)
 */
goog.provide('kemia.controller.plugins.Cleanup');
goog.require('goog.debug.Logger');
goog.require('kemia.layout.CoordinateGenerator');
/**
 * @constructor
 * @extends{kemian.controller.Plugin}s
 */
kemia.controller.plugins.Cleanup = function() {
	kemia.controller.Plugin.call(this);
}
goog.inherits(kemia.controller.plugins.Cleanup, kemia.controller.Plugin);
goog.exportSymbol('kemia.controller.plugins.Cleanup',
		kemia.controller.plugins.Cleanup);

/**
 * Commands implemented by this plugin.
 * 
 * @enum {string}
 */
kemia.controller.plugins.Cleanup.COMMAND = "cleanup";

/** @inheritDoc */
kemia.controller.plugins.Cleanup.prototype.getTrogClassId = goog.functions
		.constant(kemia.controller.plugins.Cleanup.COMMAND);

/** @inheritDoc */
kemia.controller.plugins.Cleanup.prototype.isSupportedCommand = function(
		command) {
	return command == kemia.controller.plugins.Cleanup.COMMAND;
};

/** @inheritDoc */
kemia.controller.plugins.Cleanup.prototype.execCommand = function(command,
		var_args) {
	try {

		var models = this.editorObject.getModels();
		goog.array.forEach(models, function(model) {
			if (model instanceof kemia.model.Molecule) {
				var molecule = model;
				kemia.layout.CoordinateGenerator.generate(molecule);
			} else if (model instanceof kemia.model.Reaction) {
				var reaction = model;
				goog.array.forEach(reaction.reactants, function(molecule) {
					kemia.layout.CoordinateGenerator.generate(molecule);
				});
				goog.array.forEach(reaction.products, function(molecule) {
					kemia.layout.CoordinateGenerator.generate(molecule);
				});
				reaction.removeOverlap();
			}
		});

		this.editorObject.setModels(this.editorObject.getModels());

	} catch (e) {
		this.logger.info(e);
	}
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.Cleanup.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.Cleanup');
