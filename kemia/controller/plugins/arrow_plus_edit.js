goog.provide('kemia.controller.plugins.ArrowPlusEdit');
goog.require('kemia.controller.Plugin');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{kemian.controller.Plugin}s
 */
kemia.controller.plugins.ArrowPlusEdit = function() {
	this.activeCommand = {};
	kemia.controller.Plugin.call(this);
}
goog.inherits(kemia.controller.plugins.ArrowPlusEdit, kemia.controller.Plugin);
goog.exportSymbol("kemia.controller.plugins.ArrowPlusEdit",
		kemia.controller.plugins.ArrowPlusEdit);

/**
 * Commands implemented by this plugin.
 * 
 * @enum {string}
 */
kemia.controller.plugins.ArrowPlusEdit.COMMAND = {
	EDIT_ARROW : 'editArrow',
	EDIT_PLUS : 'editPlus'
};

/**
 * Inverse map of execCommand strings to
 * {@link kemia.controller.plugins.ArrowPlusEdit.COMMAND} constants. Used to
 * determine whether a string corresponds to a command this plugin handles
 * 
 * @type {Object}
 * @private
 */
kemia.controller.plugins.ArrowPlusEdit.SUPPORTED_COMMANDS_ = goog.object
		.transpose(kemia.controller.plugins.ArrowPlusEdit.COMMAND);

/** @inheritDoc */
kemia.controller.plugins.ArrowPlusEdit.prototype.isSupportedCommand = function(
		command) {
	return command in kemia.controller.plugins.ArrowPlusEdit.SUPPORTED_COMMANDS_;
};

/** @inheritDoc */
kemia.controller.plugins.ArrowPlusEdit.prototype.getTrogClassId = goog.functions
		.constant("ArrowPlusEdit");

/**
 * sets active
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
kemia.controller.plugins.ArrowPlusEdit.prototype.execCommandInternal = function(
		command, value, active) {
	this.logger.info(command + " active: " + active);
	this.activeCommand[command] = active;
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.ArrowPlusEdit.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.ArrowPlusEdit');

kemia.controller.plugins.ArrowPlusEdit.prototype.handleArrowMouseDown = function(
		e) {
	if (this.activeCommand[kemia.controller.plugins.ArrowPlusEdit.COMMAND.EDIT_ARROW]) {
		this.editorObject.dispatchBeforeChange();
		this.dragArrow(e);
		this.editorObject.dispatchChange();
	}
}

kemia.controller.plugins.ArrowPlusEdit.prototype.handleMouseMove = function(e) {

	var target = this.editorObject.findTarget(e);

	if (target instanceof kemia.model.Arrow) {
		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightArrow(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightArrow(target,
					e.currentTarget.highlightGroup);
		}
		return true;
	} else if (target instanceof kemia.model.Plus) {
		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightPlus(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightPlus(target,
					e.currentTarget.highlightGroup);
		}
		return true;
	} else {
		if (e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup.clear();
		}
		return false;
	}
}

kemia.controller.plugins.ArrowPlusEdit.prototype.handleMouseDown = function(e) {
	var target = this.editorObject.findTarget(e);

	if (target instanceof kemia.model.Plus) {
		// this.logger.info('target' + target.toString());
		var plus = target;
		this.editorObject.dispatchBeforeChange();
		this.dragPlus(e, plus);
		this.editorObject.dispatchChange();
		return;
	}

	if (this.activeCommand[kemia.controller.plugins.ArrowPlusEdit.COMMAND.EDIT_ARROW]) {
		this.editorObject.dispatchBeforeChange();
		var trans = this.editorObject.reactionRenderer.moleculeRenderer.transform
				.createInverse();
		var coords = trans.transformCoords( [ new goog.math.Coordinate(
				e.offsetX, e.offsetY) ]);
		this.editorObject.getModels()[0].addArrow(new kemia.model.Arrow(
				coords[0]));
		this.editorObject.setModels(this.editorObject.getModels());
		this.editorObject.dispatchChange();
	} else if (this.activeCommand[kemia.controller.plugins.ArrowPlusEdit.COMMAND.EDIT_PLUS]) {
		this.editorObject.dispatchBeforeChange();
		var trans = this.editorObject.reactionRenderer.moleculeRenderer.transform
				.createInverse();
		var coords = trans.transformCoords( [ new goog.math.Coordinate(
				e.offsetX, e.offsetY) ]);
		this.editorObject.getModels()[0]
				.addPlus(new kemia.model.Plus(coords[0]));
		this.editorObject.setModels(this.editorObject.getModels());
		this.editorObject.dispatchChange();
	}
}

kemia.controller.plugins.ArrowPlusEdit.prototype.dragArrow = function(e) {
	this.logger.info("dragArrow");
	var coord = e.coord;
	var d = new goog.fx.Dragger(e.group);
	d._prevX = e.clientX;
	d._prevY = e.clientY;
	d._startX = e.clientX;
	d._startY = e.clientY;

	d.coord = coord;
	d.group = e.group;
	d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {

		// goog.array.forEach(d.molecule.getChildren(), function(child) {
			// var g_trans = child.getGroup().getTransform();
			// var newX = e.clientX - d._prevX + g_trans.getTranslateX();
			// var newY = e.clientY - d._prevY + g_trans.getTranslateY();
			// child.getGroup().setTransformation(newX, newY, 0, 0, 0);
			// });
			var trans = d.group.transform;
			var newX = e.clientX - d._prevX + trans.getTranslateX();
			var newY = e.clientY - d._prevY + trans.getTranslateY();
			d.group.setTransformation(newX, newY, 0, 0, 0);

			d._prevX = e.clientX;
			d._prevY = e.clientY;

		});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
		// var trans = new goog.graphics.AffineTransform.getTranslateInstance(
			// e.clientX - d._startX, e.clientY - d._startY);
			//
			// d.molecule.transformDrawing(trans);
			d.dispose();
		});
	d.startDrag(e);
};

/**
 * reset to default state called when another plugin is made active
 */
kemia.controller.plugins.ArrowPlusEdit.prototype.resetState = function() {
	this.activeCommand[kemia.controller.plugins.ArrowPlusEdit.COMMAND.EDIT_ARROW] = false;
	this.activeCommand[kemia.controller.plugins.ArrowPlusEdit.COMMAND.EDIT_PLUS] = false;
}

/** @inheritDoc */
kemia.controller.plugins.ArrowPlusEdit.prototype.queryCommandValue = function(
		command) {
	var state = null;
	if (this.isSupportedCommand(command)) {
		state = this.activeCommand[command];
	}
	return state;
};

kemia.controller.plugins.ArrowPlusEdit.prototype.dragPlus = function(e, plus) {
	this.dragSource = plus;
	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
	d._prevX = e.clientX;
	d._prevY = e.clientY;

	d.plus = plus;
	d.editor = this.editorObject;
	d
			.addEventListener(
					goog.fx.Dragger.EventType.DRAG,
					function(e) {

						var trans = new goog.graphics.AffineTransform.getTranslateInstance(
								e.clientX - d._prevX, e.clientY - d._prevY);

						var coords = d.editor.reactionRenderer.transform
								.createInverse().transformCoords(
										[
												new goog.math.Coordinate(
														e.clientX, e.clientY),
												new goog.math.Coordinate(
														d._prevX, d._prevY) ]);
						var diff = goog.math.Coordinate.difference(coords[0],
								coords[1]);

						d.plus.coord = goog.math.Coordinate.sum(plus.coord,
								diff);
						d.plus.group.clear();
						d.editor.reactionRenderer.plusRenderer.render(d.plus,
								d.editor.reactionRenderer.transform);

						d._prevX = e.clientX;
						d._prevY = e.clientY;

					});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {

		d.editor.setModels(d.editor.getModels());
		d.dispose();
	});
	d.startDrag(e);
};

kemia.controller.plugins.ArrowPlusEdit.prototype.highlightArrow = function(
		arrow, opt_group) {
	// this.logger.info('highlightArrow');
	return this.editorObject.reactionRenderer.arrowRenderer.highlightOn(arrow,
			opt_group);
};

kemia.controller.plugins.ArrowPlusEdit.prototype.highlightPlus = function(plus,
		opt_group) {
	// this.logger.info('highlightPlus');
	return this.editorObject.reactionRenderer.plusRenderer.highlightOn(plus,
			opt_group);
}
