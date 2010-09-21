goog.provide('kemia.model.Reaction');
goog.require('kemia.model.Molecule');
goog.require('goog.math.Box');
goog.require('goog.math.Rect');
goog.require('goog.debug.Logger');
goog.require('kemia.graphics.AffineTransform');
goog.require('kemia.model.Arrow');

/**
 * Creates a new Reaction.
 * 
 * @constructor
 */
kemia.model.Reaction = function() {
	/** @type {string} */
	this.header = "";

	/** @type {Array.<kemia.model.Molecule>} */
	this.molecules = [];

	/** @type {Array.<kemia.model.Arrow>} */
	this.arrows = [];

	/** @type {Array.<kemia.model.Pluse>} */
	this.pluses = [];

	/** @type {string} */
	this.reagentsText = "";

	/** @type {string} */
	this.conditionsText = "";
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.model.Reaction.prototype.logger = goog.debug.Logger
		.getLogger('kemia.model.Reaction');

/**
 * @return {string} the reaction header
 */
kemia.model.Reaction.prototype.getHeader = function() {
	return this.header;
}
goog.exportSymbol('kemia.model.Reaction.prototype.getHeader',
		kemia.model.Reaction.prototype.getHeader);

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.addReactant = function(mol) {
	this.addMolecule(mol);
};

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.addMolecule = function(mol) {
	this.molecules.push(mol);
	mol.reaction = this;
}

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.addProduct = function(mol) {
	this.addMolecule(mol);
};

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.isReactant = function(mol) {
	if(this.arrows[0]){
		return this.arrows[0].getOrientation(mol.getCenter())==kemia.model.Arrow.ORIENTATION.BEHIND;
	}
}

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.isProduct = function(mol) {
	if(this.arrows[0]){
		return this.arrows[0].getOrientation(mol.getCenter())==kemia.model.Arrow.ORIENTATION.AHEAD;
	}
}

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.removeMolecule = function(mol) {
		goog.array.remove(this.molecules, mol);
		mol.reaction = undefined;
}

/**
 * @param {kemia.model.Arrow}
 *            arrow
 */
kemia.model.Reaction.prototype.addArrow = function(arrow) {
	this.arrows.push(arrow);
	arrow.reaction = this;
};

/**
 * @param {kemia.model.Arrow}
 *            arrow
 */
kemia.model.Reaction.prototype.removeArrow = function(arrow) {
	this.logger.info('removeArrow');
	if (goog.array.contains(this.arrows, arrow)) {
		goog.array.remove(this.arrows, arrow);
		arrow.reaction = undefined;
	}
};

/**
 * @param {kemia.model.Plus}
 *            plus
 */
kemia.model.Reaction.prototype.addPlus = function(plus) {
	this.pluses.push(plus);
	plus.reaction = this;
};

/**
 * @param {kemia.model.Plus}
 *            plus
 */
kemia.model.Reaction.prototype.removePlus = function(plus) {
	this.logger.info('removePlus');
	goog.array.remove(this.pluses, plus);
	plus.reaction = undefined;
}
/**
 * @param {kemia.model.Arrow}
 *            arrow
 */
kemia.model.Reaction.prototype.removeArrow = function(arrow) {
	goog.array.remove(this.arrows, arrow);
	arrow.reaction = undefined;
}

/**
 * @param {kemia.model.Plus}
 *            plus
 */
kemia.model.Reaction.prototype.removePlus = function(plus) {
	this.logger.info('removePlus');
	if (goog.array.contains(this.pluses, plus)) {
		goog.array.remove(this.pluses, plus);
		plus.reaction = undefined;
	}
}

/**
 * @deprecated
 */
kemia.model.Reaction.prototype.generatePlusCoords = function(molecules) {
	var previousMol;
	goog.array.forEach(molecules, function(mol) {
		if (previousMol) {
			var center = this.center( [ previousMol, mol ]);
			this.addPlus(center);
		}
		previousMol = mol;
	}, this);

};

/**
 * @deprecated
 */
kemia.model.Reaction.prototype.generateArrowCoords = function(reactants,
		products) {
	var r_box = this.boundingBox(reactants);
	var p_box = this.boundingBox(products);
	this.addArrow(new kemia.model.Arrow(new goog.math.Coordinate(
			(r_box.right + p_box.left) / 2, (r_box.top + p_box.bottom) / 2)));
};

/**
 * bounding box of an array of molecules
 * 
 * @param {Array.
 *            <kemia.model.Molecule>} molecules
 * @return goog.math.Box
 */
kemia.model.Reaction.prototype.boundingBox = function(molecules) {
	var atoms = goog.array.flatten(goog.array.map(molecules, function(mol) {
		return mol.atoms;
	}));
	var coords = goog.array.map(atoms, function(a) {
		return a.coord;
	})
	return goog.math.Box.boundingBox.apply(null, coords);
};

/**
 * finds center of an array of molecules
 * 
 * @param {Array.
 *            <kemia.model.Molecule>} molecules
 * @return goog.math.Coordinate
 */
kemia.model.Reaction.prototype.center = function(molecules) {

	var bbox = this.boundingBox(molecules);

	return new goog.math.Coordinate((bbox.left + bbox.right) / 2,
			(bbox.top + bbox.bottom) / 2);
};

/**
 * layout molecules to eliminate any molecule overlap, if necessary
 */
kemia.model.Reaction.prototype.removeOverlap = function() {
	var margin = 4;
	var molecules = goog.array.concat(this.reactants, this.products);
	var accumulated_rect;
	goog.array
			.forEach(molecules,
					function(mol) {
						var mol_rect = goog.math.Rect.createFromBox(this
								.boundingBox( [ mol ]));

						if (accumulated_rect) {

							if (goog.math.Rect.intersection(accumulated_rect,
									mol_rect)) {
								this.translateMolecule(mol,
										new goog.math.Coordinate(margin
												+ accumulated_rect.left
												+ accumulated_rect.width
												- mol_rect.left, 0));
							}
							// expand to include this molecule location
					accumulated_rect.boundingRect(goog.math.Rect
							.createFromBox(this.boundingBox( [ mol ])));
				} else {
					accumulated_rect = mol_rect;
				}
			}, this);

};

/**
 * translate molecule coordinates
 * 
 * @param {kemia.model.Molecule}
 *            molecule, the molecule to translate
 * @param {goog.math.Coordinate}
 *            coord, contains x and y change amounts
 * 
 * @return {kemia.model.Molecule}
 */
kemia.model.Reaction.prototype.translateMolecule = function(molecule, coord) {

	goog.array.forEach(molecule.atoms, function(a) {
		a.coord = goog.math.Coordinate.sum(a.coord, coord);
	});

	return molecule;
};

/**
 * rotate molecule coordinates
 * 
 * @param {kemia.model.Molecule}
 *            molecule, the molecule to rotate
 * @param {number}
 *            degrees, angle of rotation
 * @param {goog.math.Coordinate}
 *            center, coordinates of center of rotation
 * 
 * @return {kemia.model.Molecule}
 */
kemia.model.Reaction.prototype.rotateMolecule = function(molecule, degrees,
		center) {

	var trans = kemia.graphics.AffineTransform.getRotateInstance(goog.math
			.toRadians(degrees), center.x, center.y);
	goog.array.forEach(molecule.atoms, function(a) {
		a.coord = trans.transformCoords( [ a.coord ])[0];
	});
	return molecule;
}
