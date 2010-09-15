goog.provide('kemia.controller.plugins.Move');
goog.require('kemia.controller.Plugin');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{kemian.controller.Plugin}s
 */
kemia.controller.plugins.Move = function() {
	kemia.controller.Plugin.call(this);
	this.isActive = true;
}
goog.inherits(kemia.controller.plugins.Move, kemia.controller.Plugin);
goog.exportSymbol('kemia.controller.plugins.Move',
		kemia.controller.plugins.Move);

/**
 * Command implemented by this plugin.
 */
kemia.controller.plugins.Move.COMMAND = 'move';

/** @inheritDoc */
kemia.controller.plugins.Move.prototype.isSupportedCommand = function(command) {
	return command == kemia.controller.plugins.Move.COMMAND;
};

/** @inheritDoc */
kemia.controller.plugins.Move.prototype.getTrogClassId = goog.functions
		.constant(kemia.controller.plugins.Move.COMMAND);

/**
 * reset to default state called when another plugin is made active
 */
kemia.controller.plugins.Move.prototype.resetState = function() {
	this.isActive = false;
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
	this.isActive = active;
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.Move.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.Move');

kemia.controller.plugins.Move.prototype.handleMouseMove = function(e) {
	if (this.isActive) {
		var target = this.editorObject.findTarget(e);
		this.editorObject.getOriginalElement().style.cursor = 'default';
		if (e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup.clear();
		}
		if (target instanceof kemia.model.Atom) {
			this.editorObject.getOriginalElement().style.cursor = 'move';
			if (!e.currentTarget.highlightGroup) {
				e.currentTarget.highlightGroup = this.highlightAtom(target);
			} else {
				e.currentTarget.highlightGroup = this.highlightAtom(target,
						e.currentTarget.highlightGroup);
			}
			return true;
		} else if (target instanceof kemia.model.Bond) {
			this.editorObject.getOriginalElement().style.cursor = 'move';
			if (!e.currentTarget.highlightGroup) {
				e.currentTarget.highlightGroup = this.highlightBond(target);
			} else {
				e.currentTarget.highlightGroup = this.highlightBond(target,
						e.currentTarget.highlightGroup);
			}
			return true;
		} else if (target instanceof kemia.model.Molecule) {
			if (e.shiftKey) {
				this.editorObject.getOriginalElement().style.cursor = 'pointer';// TTD
				// need
				// better
				// icon
			} else {
				this.editorObject.getOriginalElement().style.cursor = 'move';
			}
			if (!e.currentTarget.highlightGroup) {
				e.currentTarget.highlightGroup = this.highlightMolecule(target);
			} else {
				e.currentTarget.highlightGroup = this.highlightMolecule(target,
						e.currentTarget.highlightGroup);
			}
			return true;
		} else if (target instanceof kemia.model.Arrow) {
			this.editorObject.getOriginalElement().style.cursor = 'move';
			if (!e.currentTarget.highlightGroup) {
				e.currentTarget.highlightGroup = this.highlightArrow(target);
			} else {
				e.currentTarget.highlightGroup = this.highlightArrow(target,
						e.currentTarget.highlightGroup);
			}
			return true;
		} else if (target instanceof kemia.model.Plus) {
			this.editorObject.getOriginalElement().style.cursor = 'move';
			if (!e.currentTarget.highlightGroup) {
				e.currentTarget.highlightGroup = this.highlightPlus(target);
			} else {
				e.currentTarget.highlightGroup = this.highlightPlus(target,
						e.currentTarget.highlightGroup);
			}
			return true;
		}
		return false;

	}
}

kemia.controller.plugins.Move.prototype.handleMouseDown = function(e) {
	var target = this.editorObject.findTarget(e);
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
	return false;
};

kemia.controller.plugins.Move.prototype.handleMouseUp = function(e) {
	var targets = goog.array
			.filter(
					this.editorObject.findTargetList(e),
					function(obj) {
						return (obj instanceof kemia.model.Atom && obj !== this.dragSource);
					}, this);
	var target = targets.length > 0 ? targets[0] : undefined;
	if (this.dragSource && target instanceof kemia.model.Atom) {
		this.editorObject.dispatchBeforeChange();
		kemia.controller.plugins.Move.mergeMolecules(this.dragSource, target);
		this.dragSource = undefined;
		this.editorObject.setModels(this.editorObject.getModels());
		this.editorObject.dispatchChange();
		return true;
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
	// this.logger.info('highlightAtom');
	return this.editorObject.reactionRenderer.moleculeRenderer.atomRenderer
			.highlightOn(atom, 'blue', opt_group);
};

kemia.controller.plugins.Move.prototype.highlightBond = function(bond,
		opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.bondRendererFactory
			.get(bond).highlightOn(bond, 'blue', opt_group);
};

kemia.controller.plugins.Move.prototype.highlightMolecule = function(molecule,
		opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.highlightOn(
			molecule, 'blue', opt_group);
}

kemia.controller.plugins.Move.prototype.highlightArrow = function(arrow,
		opt_group) {
	return this.editorObject.reactionRenderer.arrowRenderer.highlightOn(arrow,
			'blue', opt_group);
};

kemia.controller.plugins.Move.prototype.highlightPlus = function(plus,
		opt_group) {
	return this.editorObject.reactionRenderer.plusRenderer.highlightOn(plus,
			'blue', opt_group);
};

/** @inheritDoc */
kemia.controller.plugins.Move.prototype.queryCommandValue = function(command) {
	var state = null;
	if (command == kemia.controller.plugins.Move.COMMAND) {
		state = this.isActive;
	}
	return state;
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
	d
			.addEventListener(
					goog.fx.Dragger.EventType.DRAG,
					function(e) {
						d.atom.molecule.group.clear();
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

						atom.coord = goog.math.Coordinate.sum(atom.coord, diff);

						d.editor.reactionRenderer.moleculeRenderer.render(
								d.atom.molecule,
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


kemia.controller.plugins.Move.prototype.dragBond = function(e, bond) {

	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
	d._prevX = e.clientX;
	d._prevY = e.clientY;

	d.bond = bond;
	d.editor = this.editorObject;
	d
			.addEventListener(
					goog.fx.Dragger.EventType.DRAG,
					function(e) {
						d.bond.molecule.group.clear();
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

						bond.source.coord = goog.math.Coordinate.sum(
								bond.source.coord, diff);
						bond.target.coord = goog.math.Coordinate.sum(
								bond.target.coord, diff);
						d.editor.reactionRenderer.moleculeRenderer.render(
								bond.molecule,
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

		d.editor.setModels(d.editor.getModels());
		d.dispose();
	});
	d.startDrag(e);
};

kemia.controller.plugins.Move.prototype.dragArrow = function(e, arrow) {
	this.logger.info("dragArrow");
	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());

	d._initDeltaX = null;
	d._initDeltaY = null;
	d._prevDeltaX = 0;
	d._prevDeltaY = 0;
	d.arrow = arrow;
	d.editor = this.editorObject;
	d.addEventListener(goog.fx.Dragger.EventType.DRAG, function(e) {
		d._initDeltaX = d._initDeltaX || d.deltaX;
		d._initDeltaY = d._initDeltaY || d.deltaY;
		var deltaX = d.deltaX - d._initDeltaX;
		var deltaY = d.deltaY - d._initDeltaY;
		var deltaDeltaX = deltaX - d._prevDeltaX;
		var deltaDeltaY = deltaY - d._prevDeltaY;

		// move graphic
			d.arrow.group.setTransformation(deltaX, deltaY, 0, 0, 0);

			// move molecule
			var diff = new goog.math.Coordinate(deltaDeltaX
					/ d.editor.reactionRenderer.transform.getScaleX(),
					deltaDeltaY
							/ d.editor.reactionRenderer.transform.getScaleY());

			// d._prev = mouse_coord;
			d._prevDeltaX = d.deltaX - d._initDeltaX;
			d._prevDeltaY = d.deltaY - d._initDeltaY;
		});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {

		d.editor.setModels(d.editor.getModels());
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

						// move molecule
						var diff = new goog.math.Coordinate(deltaDeltaX
								/ d.editor.reactionRenderer.transform
										.getScaleX(), deltaDeltaY
								/ d.editor.reactionRenderer.transform
										.getScaleY());
						d.molecule.reaction.translateMolecule(d.molecule, diff);

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
				kemia.controller.plugins.AtomEdit.mergeMolecules(pair[0],
						pair[1]);
			}, this);
			d.editor.setModels(d.editor.getModels());
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

	d._center = this.editorObject.reactionRenderer.transform
			.transformCoords( [ molecule.getCenter() ])[0];
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
		var g_trans = d.group.getTransform();
		var degrees = new_angle - d._start_angle;
		d.group.setTransformation(0, 0, degrees, d._center.x, d._center.y);
	});
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
		var mol_center = d.editor.reactionRenderer.transform.createInverse()
				.transformCoords( [ d._center ])[0];
		var new_angle = goog.math.angle(d._center.x, d._center.y, d._start.x
				+ d.deltaX, d._start.y + d.deltaY);

		var degrees = new_angle - d._start_angle;
		d.molecule.reaction.rotateMolecule(d.molecule, -degrees, mol_center);
		d.editor.setModels(d.editor.getModels());
		d.dispose();
	});
	d.startDrag(e);
};
