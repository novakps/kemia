goog.provide('kemia.controller.plugins.Move');
goog.require('kemia.controller.Plugin');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{kemian.controller.Plugin}s
 */
kemia.controller.plugins.Move = function() {
	kemia.controller.Plugin.call(this);
	this.isActive = {};
	this.isActive[kemia.controller.plugins.Move.COMMAND.MOVE] = true;
	this.isDragging = false;
}
goog.inherits(kemia.controller.plugins.Move, kemia.controller.Plugin);
goog.exportSymbol('kemia.controller.plugins.Move',
		kemia.controller.plugins.Move);

/**
 * Commands implemented by this plugin.
 * 
 * @enum {string}
 */
kemia.controller.plugins.Move.COMMAND = {
	MOVE : 'move',
	ROTATE : 'rotate'
}

/**
 * Inverse map of execCommand strings to
 * {@link kemia.controller.plugins.Move.COMMAND} constants. Used to determine
 * whether a string corresponds to a command this plugin handles
 * 
 * @type {Object}
 * @private
 */
kemia.controller.plugins.Move.SUPPORTED_COMMANDS_ = goog.object
		.transpose(kemia.controller.plugins.Move.COMMAND);

kemia.controller.plugins.Move.ROTATE_CURSOR_STYLE = 'url("../../elements/images/rotate-cursor-32.png") 16 16,  pointer';

/** @inheritDoc */
kemia.controller.plugins.Move.prototype.isSupportedCommand = function(command) {
	return command in kemia.controller.plugins.Move.SUPPORTED_COMMANDS_;
};

/** @inheritDoc */
kemia.controller.plugins.Move.prototype.getTrogClassId = goog.functions
		.constant('move');

/**
 * reset to default state called when another plugin is made active
 */
kemia.controller.plugins.Move.prototype.resetState = function() {
	this.isActive[kemia.controller.plugins.Move.COMMAND.MOVE] = false;
	this.isActive[kemia.controller.plugins.Move.COMMAND.ROTATE] = false;
}

/**
 * sets atom symbol.
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
kemia.controller.plugins.Move.prototype.execCommandInternal = function(command,
		value, active) {
	// this.logger.info(command + " " + active);
	this.isActive[command] = active;
};

kemia.controller.plugins.Move.prototype.handleMouseMove = function(e) {

	if ((this.isActive[kemia.controller.plugins.Move.COMMAND.MOVE] || this.isActive[kemia.controller.plugins.Move.COMMAND.ROTATE])
			&& !this.isDragging) {
		var target = this.editorObject.findTarget(e);
		this.editorObject.clearSelected();
		this.editorObject.getOriginalElement().style.cursor = 'default';
		if (e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup.clear();
		}
		if (this.isActive[kemia.controller.plugins.Move.COMMAND.ROTATE]) {
			if (target instanceof kemia.model.Molecule) {
				this.editorObject.addSelected(target);
				this.editorObject.getOriginalElement().style.cursor = kemia.controller.plugins.Move.ROTATE_CURSOR_STYLE;
				if (!e.currentTarget.highlightGroup) {
					e.currentTarget.highlightGroup = this
							.highlightMolecule(target);
				} else {
					e.currentTarget.highlightGroup = this.highlightMolecule(
							target, e.currentTarget.highlightGroup);
				}
				return true;
			}
		} else {
			if (target instanceof kemia.model.Atom) {
				this.editorObject.addSelected(target);
				this.editorObject.getOriginalElement().style.cursor = 'move';
				if (!e.currentTarget.highlightGroup) {
					e.currentTarget.highlightGroup = this.highlightAtom(target);
				} else {
					e.currentTarget.highlightGroup = this.highlightAtom(target,
							e.currentTarget.highlightGroup);
				}
				return true;
			} else if (target instanceof kemia.model.Bond) {
				this.editorObject.addSelected(target);
				this.editorObject.getOriginalElement().style.cursor = 'move';
				if (!e.currentTarget.highlightGroup) {
					e.currentTarget.highlightGroup = this.highlightBond(target);
				} else {
					e.currentTarget.highlightGroup = this.highlightBond(target,
							e.currentTarget.highlightGroup);
				}
				return true;
			} else if (target instanceof kemia.model.Molecule) {
				this.editorObject.addSelected(target);
				this.editorObject.getOriginalElement().style.cursor = 'move';
				if (!e.currentTarget.highlightGroup) {
					e.currentTarget.highlightGroup = this
							.highlightMolecule(target);
				} else {
					e.currentTarget.highlightGroup = this.highlightMolecule(
							target, e.currentTarget.highlightGroup);
				}
				return true;
			} else if (target instanceof kemia.model.Arrow) {
				this.editorObject.addSelected(target);
				if (!e.shiftKey) {
					this.editorObject.getOriginalElement().style.cursor = 'move';
					if (!e.currentTarget.highlightGroup) {
						e.currentTarget.highlightGroup = this
								.highlightArrow(target);
					} else {
						e.currentTarget.highlightGroup = this.highlightArrow(
								target, e.currentTarget.highlightGroup);
					}
					return true;
				}
			} else if (target instanceof kemia.model.Plus) {
				this.editorObject.addSelected(target);
				if (!e.shiftKey) {
					this.editorObject.getOriginalElement().style.cursor = 'move';
					if (!e.currentTarget.highlightGroup) {
						e.currentTarget.highlightGroup = this
								.highlightPlus(target);
					} else {
						e.currentTarget.highlightGroup = this.highlightPlus(
								target, e.currentTarget.highlightGroup);
					}
					return true;
				}
			}
		}
		return false;
	}
}

kemia.controller.plugins.Move.prototype.handleMouseDown = function(e) {

	if (this.isActive[kemia.controller.plugins.Move.COMMAND.MOVE]
			|| this.isActive[kemia.controller.plugins.Move.COMMAND.ROTATE]) {
		if (e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup.clear();
		}
		e.currentTarget.highlightGroup = undefined;
		this.isDragging = true;
		var target = this.editorObject.findTarget(e);

		if (this.isActive[kemia.controller.plugins.Move.COMMAND.ROTATE]) {
			if (target instanceof kemia.model.Molecule) {
				var molecule = target;
				this.editorObject.dispatchBeforeChange();
				this.editorObject.getOriginalElement().style.cursor = kemia.controller.plugins.Move.ROTATE_CURSOR_STYLE;
				this.rotateMolecule(e, target);
				this.editorObject.dispatchChange();
				return true;
			}
		}

		if (this.isActive[kemia.controller.plugins.Move.COMMAND.MOVE]) {
			if (target instanceof kemia.model.Atom) {
				var atom = target;
				this.editorObject.dispatchBeforeChange();
				this.dragAtom(e, atom);
				this.editorObject.dispatchChange();
				return true;
			}
			if (target instanceof kemia.model.Bond) {
				var bond = target;
				this.editorObject.dispatchBeforeChange();
				this.dragBond(e, bond);
				this.editorObject.dispatchChange();
				return true;
			}
			if (target instanceof kemia.model.Molecule) {
				var molecule = target;
				this.editorObject.dispatchBeforeChange();
				if (e.shiftKey) {
					this.editorObject.getOriginalElement().style.cursor = kemia.controller.plugins.Move.ROTATE_CURSOR_STYLE;
					this.rotateMolecule(e, target);
				} else {
					this.dragMolecule(e, target);
				}
				this.editorObject.dispatchChange();
				return true;
			}
			if (target instanceof kemia.model.Plus) {
				var plus = target;
				this.editorObject.dispatchBeforeChange();
				this.dragPlus(e, plus);
				this.editorObject.dispatchChange();
				return true;
			}
			if (target instanceof kemia.model.Arrow) {
				var arrow = target;
				this.editorObject.dispatchBeforeChange();
				this.dragArrow(e, arrow);
				this.editorObject.dispatchChange();
				return true;
			}
		}
	}
	return false;

};

kemia.controller.plugins.Move.prototype.handleMouseUp = function(e) {
	try {
		this.isDragging = false;
		var targets = goog.array
				.filter(
						this.editorObject.findTargetList(e),
						function(obj) {
							return (obj instanceof kemia.model.Atom && obj !== this.dragSource);
						}, this);
		var target = targets.length > 0 ? targets[0] : undefined;
		if (this.dragSource && target instanceof kemia.model.Atom) {
			this.editorObject.dispatchBeforeChange();
			kemia.controller.plugins.Move.mergeMolecules(this.dragSource,
					target);
			this.dragSource = undefined;
			this.editorObject.setModelsSilently(this.editorObject.getModels());
			this.editorObject.dispatchChange();
			return true;
		}
	} catch (e) {
		this.logger.info(e);
	}
}
/**
 * merge two molecules at a single atom
 * 
 * @param{kemia.model.Atom} source_atom, the atom being dragged
 * @param{kemia.model.Atom} target_atom, the drag-target atom
 * 
 * @return{kemia.model.Molecule} resulting merged molecule
 */
kemia.controller.plugins.Move.mergeMolecules = function(source_atom,
		target_atom) {
	// replace target atom with source atom

	// clone and connect target atom bonds to source atom
	var source_molecule = source_atom.molecule;
	var target_molecule = target_atom.molecule;

	goog.array.forEach(target_atom.bonds.getValues(), function(bond) {
		var new_bond = bond.clone();
		target_atom == new_bond.source ? new_bond.source = source_atom
				: new_bond.target = source_atom;
		target_molecule.addBond(new_bond);
		target_molecule.removeBond(bond);
	});
	target_molecule.removeAtom(target_atom);

	goog.array.forEach(source_molecule.atoms, function(atom) {
		target_molecule.addAtom(atom);
	});

	// replace source atom and bonds parent molecule with target parent molecule
	goog.array.forEach(source_molecule.bonds, function(bond) {
		var new_bond = bond.clone();
		new_bond.molecule = undefined;
		target_molecule.addBond(new_bond);
	});
	goog.array.forEach(source_molecule.atoms, function(atom) {
		source_molecule.removeAtom(atom);
	});
	goog.array.forEach(source_molecule.bonds, function(bond) {
		source_molecule.removeBond(bond);
	});

	source_molecule.reaction.removeMolecule(source_molecule);
	delete source_molecule;
	return target_molecule;
}

kemia.controller.plugins.Move.prototype.highlightAtom = function(atom,
		opt_group) {

	return this.editorObject.reactionRenderer.moleculeRenderer.atomRenderer
			.highlightOn(atom, '#3366ff', opt_group);

};

kemia.controller.plugins.Move.prototype.highlightBond = function(bond,
		opt_group) {

	return this.editorObject.reactionRenderer.moleculeRenderer.bondRendererFactory
			.get(bond).highlightOn(bond, '#3366ff', opt_group);

};

kemia.controller.plugins.Move.prototype.highlightMolecule = function(molecule,
		opt_group) {
	var color = '#3366ff';

	if (molecule.reaction && molecule.reaction.isProduct(molecule)) {
		color = 'purple';
	}
	return this.editorObject.reactionRenderer.moleculeRenderer.highlightOn(
			molecule, color, opt_group);
}

kemia.controller.plugins.Move.prototype.highlightArrow = function(arrow,
		opt_group) {
	return this.editorObject.reactionRenderer.arrowRenderer.highlightOn(arrow,
			'#3366ff', opt_group);
};

kemia.controller.plugins.Move.prototype.highlightPlus = function(plus,
		opt_group) {
	return this.editorObject.reactionRenderer.plusRenderer.highlightOn(plus,
			'#3366ff', opt_group);
};

/** @inheritDoc */
kemia.controller.plugins.Move.prototype.queryCommandValue = function(command) {

	return this.isActive[command];
};

/**
 * merge two molecules at a single atom
 * 
 * @param{kemia.model.Atom} source_atom, the atom being dragged
 * @param{kemia.model.Atom} target_atom, the drag-target atom
 * 
 * @return{kemia.model.Molecule} resulting merged molecule
 */
kemia.controller.plugins.Move.mergeMolecules = function(source_atom,
		target_atom) {
	// replace target atom with source atom

	// clone and connect target atom bonds to source atom
	var source_molecule = source_atom.molecule;
	var target_molecule = target_atom.molecule;

	goog.array.forEach(target_atom.bonds.getValues(), function(bond) {
		var new_bond = bond.clone();
		target_atom == new_bond.source ? new_bond.source = source_atom
				: new_bond.target = source_atom;
		target_molecule.addBond(new_bond);
		target_molecule.removeBond(bond);
	});
	target_molecule.removeAtom(target_atom);

	goog.array.forEach(source_molecule.atoms, function(atom) {
		target_molecule.addAtom(atom);
	});

	// replace source atom and bonds parent molecule with target parent molecule
	goog.array.forEach(source_molecule.bonds, function(bond) {
		var new_bond = bond.clone();
		new_bond.molecule = undefined;
		target_molecule.addBond(new_bond);
	});
	goog.array.forEach(source_molecule.atoms, function(atom) {
		source_molecule.removeAtom(atom);
	});
	goog.array.forEach(source_molecule.bonds, function(bond) {
		source_molecule.removeBond(bond);
	});

	source_molecule.reaction.removeMolecule(source_molecule);
	delete source_molecule;
	return target_molecule;
}

kemia.controller.plugins.Move.prototype.dragAtom = function(e, atom) {

	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
	d._prevX = e.clientX;
	d._prevY = e.clientY;

	d.atom = atom;
	d.editor = this.editorObject;
	d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
		d.atom.molecule.group.clear();
		var trans = new goog.graphics.AffineTransform.getTranslateInstance(
				e.clientX - d._prevX, e.clientY - d._prevY);
		var inverse;
		if (d.editor.reactionRenderer.transform) {
			inverse = d.editor.reactionRenderer.transform.createInverse();
		} else {
			inverse = d.editor.reactionRenderer.moleculeRenderer.transform
					.createInverse();
		}

		var coords = inverse.transformCoords( [
				new goog.math.Coordinate(e.clientX, e.clientY),
				new goog.math.Coordinate(d._prevX, d._prevY) ]);
		var diff = goog.math.Coordinate.difference(coords[0], coords[1]);

		atom.coord = goog.math.Coordinate.sum(atom.coord, diff);

		d.editor.reactionRenderer.moleculeRenderer.render(d.atom.molecule,
				d.editor.reactionRenderer.moleculeRenderer.transform);

		d._prevX = e.clientX;
		d._prevY = e.clientY;

	});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {

		d.editor.setModelsSilently(d.editor.getModels());
		d.dispose();
	});
	d.startDrag(e);
};

kemia.controller.plugins.Move.prototype.dragBond = function(e, bond) {
	var center;
	if (bond.source.bonds.getValues().length == 1) {
		center = bond.target.coord;
	} else if (bond.target.bonds.getValues().length == 1) {
		center = bond.source.coord;
	}

	if (center) {
		var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
		d._center = center;
		var trans;
		if (this.editorObject.reactionRenderer.transform) {
			trans = this.editorObject.reactionRenderer.transform;
		} else {
			trans = this.editorObject.reactionRenderer.moleculeRenderer.transform;
		}
		d._transformed_center = trans.transformCoords([center])[0];
		d._start = kemia.controller.ReactionEditor.getMouseCoords(e);
		d._prev_angle = goog.math.angle(d._transformed_center.x, d._transformed_center.y, d._start.x,
				d._start.y);
		d.bond = bond;
		d.editor = this.editorObject;

		d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
			d.bond.molecule.group.clear();
			d._initDeltaX = d._initDeltaX || d.deltaX;
			d._initDeltaY = d._initDeltaY || d.deltaY;
			var deltaX = d.deltaX - d._initDeltaX;
			var deltaY = d.deltaY - d._initDeltaY;
			var new_angle = goog.math.angle(d._transformed_center.x, d._transformed_center.y, d._start.x
					+ deltaX, d._start.y + deltaY);
			
			var delta_angle = new_angle - d._prev_angle;
			d._prev_angle = new_angle;
			var trans = kemia.graphics.AffineTransform.getRotateInstance(
					-goog.math.toRadians(delta_angle), 
					d._center.x, 
					d._center.y);
			var coords = trans.transformCoords([d.bond.source.coord, d.bond.target.coord]);
			d.bond.source.coord = coords[0];
			d.bond.target.coord = coords[1];
			d.editor.setModelsSilently(d.editor.getModels());

		});
		d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
			d.dispose();
		});
		d.startDrag(e);
	}
};

kemia.controller.plugins.Move.prototype.dragPlus = function(e, plus) {

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

		d.editor.setModelsSilently(d.editor.getModels());
		d.dispose();
	});
	d.startDrag(e);
};

kemia.controller.plugins.Move.prototype.dragArrow = function(e, arrow) {

	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
	d._prevX = e.clientX;
	d._prevY = e.clientY;

	d.arrow = arrow;
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

						arrow.source = goog.math.Coordinate.sum(arrow.source,
								diff);
						arrow.target = goog.math.Coordinate.sum(arrow.target,
								diff);
						arrow.group.clear();
						d.editor.reactionRenderer.arrowRenderer.render(arrow,
								d.editor.reactionRenderer.transform);

						d._prevX = e.clientX;
						d._prevY = e.clientY;

					});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {

		d.editor.setModelsSilently(d.editor.getModels());
		d.dispose();
	});
	d.startDrag(e);
};

kemia.controller.plugins.Move.prototype.dragMolecule = function(e, molecule) {

	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
	d._center = this.editorObject.getGraphicsCoords(molecule.getCenter());
	d._initDeltaX = null;
	d._initDeltaY = null;
	d._prevDeltaX = 0;
	d._prevDeltaY = 0;
	d.molecule = molecule;
	d.editor = this.editorObject;
	d
			.addEventListener(
					goog.fx.Dragger.EventType.DRAG,
					function(e) {
						if (d._highlightGroups) {
							goog.array.forEach(d._highlightGroups, function(g) {
								g.clear();
							})
						}
						d._highlightGroups = [];
						d._initDeltaX = d._initDeltaX || d.deltaX;
						d._initDeltaY = d._initDeltaY || d.deltaY;
						var deltaX = d.deltaX - d._initDeltaX;
						var deltaY = d.deltaY - d._initDeltaY;
						var deltaDeltaX = deltaX - d._prevDeltaX;
						var deltaDeltaY = deltaY - d._prevDeltaY;

						// move graphic
						d.molecule.group.setTransformation(deltaX, deltaY, 0,
								0, 0);

						var trans;
						if (d.editor.reactionRenderer.transform) {
							trans = d.editor.reactionRenderer.transform;
						} else {
							trans = d.editor.reactionRenderer.moleculeRenderer.transform;
						}

						// move molecule
						var diff = new goog.math.Vec2(deltaDeltaX
								/ trans.getScaleX(), deltaDeltaY
								/ trans.getScaleY());
						d.molecule.translate(diff);

						// d._prev = mouse_coord;
						d._prevDeltaX = d.deltaX - d._initDeltaX;
						d._prevDeltaY = d.deltaY - d._initDeltaY

						// highlight merge sites
						var merge_pairs = this.findAtomMergePairs(molecule);

						// only first merge pair for now
						if (merge_pairs.length > 0) {
							merge_pairs = [ merge_pairs[0] ];
						}
						goog.array
								.forEach(
										merge_pairs,
										function(pair) {
											d._highlightGroups
													.push(d.editor.reactionRenderer.moleculeRenderer.atomRenderer
															.highlightOn(pair[0]));
											d._highlightGroups
													.push(d.editor.reactionRenderer.moleculeRenderer.atomRenderer
															.highlightOn(pair[1]));
										});

					}, undefined, this);
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
		var merge_pairs = this.findAtomMergePairs(d.molecule);

		// only first merge pair for now
			if (merge_pairs.length > 0) {
				merge_pairs = [ merge_pairs[0] ];
			}
			goog.array.forEach(merge_pairs, function(pair) {
				kemia.controller.plugins.Move.mergeMolecules(pair[0], pair[1]);
			}, this);
			d.editor.setModelsSilently(d.editor.getModels());
			d.dispose();
		}, undefined, this);

	d.startDrag(e);
};

kemia.controller.plugins.Move.prototype.findAtomMergePairs = function(molecule) {
	return goog.array.filter(goog.array.map(molecule.atoms, function(atom) {
		var nearest = this.editorObject.neighborList.getNearestList( {
			x : atom.coord.x,
			y : atom.coord.y
		}, this);
		var other_atoms = goog.array.filter(nearest, function(other) {
			if (other instanceof kemia.model.Atom) {
				if (!goog.array.contains(molecule.atoms, other)) {
					return true;
				}
			}
			return false;
		});
		if (other_atoms.length > 0) {
			return [ atom, other_atoms[0] ];
		} else {
			return false;
		}
	}, this), function(pair) {
		return pair != false;
	}, this);
};

kemia.controller.plugins.Move.prototype.rotateMolecule = function(e, molecule) {

	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());

	var trans;
	if (this.editorObject.reactionRenderer.transform) {
		trans = this.editorObject.reactionRenderer.transform;
	} else {
		trans = this.editorObject.reactionRenderer.moleculeRenderer.transform;
	}

	d._center = trans.transformCoords( [ molecule.getCenter() ])[0];
	d._start = kemia.controller.ReactionEditor.getMouseCoords(e);
	d._start_angle = goog.math.angle(d._center.x, d._center.y, d._start.x,
			d._start.y);
	d._initDeltaX = null;
	d._initDeltaY = null;
	d.group = molecule.group;
	d.molecule = molecule;
	d.editor = this.editorObject;

	d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
		d._initDeltaX = d._initDeltaX || d.deltaX;
		d._initDeltaY = d._initDeltaY || d.deltaY;
		var deltaX = d.deltaX - d._initDeltaX;
		var deltaY = d.deltaY - d._initDeltaY;
		var new_angle = goog.math.angle(d._center.x, d._center.y, d._start.x
				+ deltaX, d._start.y + deltaY);
		d._degrees = new_angle - d._start_angle;
		d.group.setTransformation(0, 0, d._degrees, d._center.x, d._center.y);
	});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
		d.molecule.rotate(-d._degrees, d.molecule.getCenter());
		d.editor.setModelsSilently(d.editor.getModels());
		d.dispose();
	});
	d.startDrag(e);
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.Move.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.Move');
