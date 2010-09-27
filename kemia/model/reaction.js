goog.provide('kemia.model.Reaction');
goog.require('kemia.model.Molecule');
goog.require('goog.math.Box');
goog.require('goog.math.Rect');
goog.require('goog.debug.Logger');
goog.require('kemia.graphics.AffineTransform');
goog.require('kemia.model.Arrow');
goog.require('goog.asserts');

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
	this.arrow = new kemia.model.Arrow();

	/** @type {Array.<kemia.model.Pluse>} */
	this.pluses = [];
	

};

/**
 * @const
 */
kemia.model.Reaction.MOLECULE_MARGIN = 4;


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
 * adds a molecule to reaction, changing layout if necessary to keep reactants
 * behind arrow and products ahead of arrow
 * 
 * @param {kemia.model.Molecule}
 *            mol reactant to add
 */
kemia.model.Reaction.prototype.addReactant = function(mol) {
	if(!this.isReactant(mol)){
		// have to change layout to make room for a new reactant
		var reactants = this.getReactants();
		var r_diff;
		var mol_box = mol.getBoundingBox();
		if(reactants.length>0){
			var reactant_box = kemia.model.Reaction.boundingBox(reactants);
			r_diff = new goog.math.Vec2(reactant_box.right - mol_box.left, 0);
		} else {
			r_diff = new goog.math.Vec2(mol_box.left, 0);
		}
		// move new reactant to the right of existing reactants, if any
		mol.translate(r_diff);
		if(!this.isReactant(mol)){
			// have to move the arrow and any products
			var products = this.getProducts();
			var diff = new goog.math.Vec2(mol.getBoundingBox().right - this.arrow.source.x);
			this.arrow.translate(diff);
			// move products, since arrow moved
			goog.array.forEach(products, function(mol){
				mol.translate(diff);
			})
		}
		goog.asserts.assert(this.isReactant(mol));
	} 
	this.addMolecule(mol);
};

kemia.model.Reaction.prototype.getReactants = function() {
	return goog.array.filter(this.molecules, this.isReactant, this);
}

kemia.model.Reaction.prototype.getProducts = function() {
	return goog.array.filter(this.molecules, this.isProduct, this);
}

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.addMolecule = function(mol) {
	this.molecules.push(mol);
	mol.reaction = this;
}

/**
 * adds a molecule as a product rearranging layout as necessary to keep
 * reactants behind arrow and products ahead of arrow
 * 
 * @param {kemia.model.Molecule}
 *            mol product to add
 */
kemia.model.Reaction.prototype.addProduct = function(mol) {
	if(!this.isProduct(mol)){
		// translate mol to the right of products, or of arrow, if no products
		var products = this.getProducts();
		var mol_box = mol.getBoundingBox();
		var x_diff;
		if(products.length>0){
			var prod_box = kemia.model.Reaction.boundingBox(products);
			x_diff =  prod_box.right - mol_box.left;
		} else {
			x_diff = this.arrow.target.x - mol_box.left;
		}
		mol.translate(new goog.math.Vec2(x_diff, 0));
		goog.asserts.assert(this.isProduct(mol));
	}
	this.addMolecule(mol);
};

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.isReactant = function(mol) {
	if(this.arrow){
		return this.arrow.getOrientation(mol.getCenter())==kemia.model.Arrow.ORIENTATION.BEHIND;
	}
}

/**
 * @param {kemia.model.Molecule}
 *            mol
 */
kemia.model.Reaction.prototype.isProduct = function(mol) {
	if(this.arrow){
		return this.arrow.getOrientation(mol.getCenter())==kemia.model.Arrow.ORIENTATION.AHEAD;
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
kemia.model.Reaction.prototype.setArrow = function(arrow) {
	
	if(this.arrow){
		this.arrow.reaction = undefined;
	}
	/** @type {kemia.model.Arrow} */
	this.arrow = arrow;
	arrow.reaction = this;
};

/**
 * setter delegates to arrow
 * @param{string} text
 */
kemia.model.Reaction.prototype.setReagentsText = function(text){
	this.arrow.setReagentsText(text);
};

/** 
 * getter delegates to arrow
 * @return{string}
 */
kemia.model.Reaction.prototype.getReagentsText = function(){
	return this.arrow.reagents_text;
}

/** 
 * getter delegates to arrow
 * @return{string}
 */
kemia.model.Reaction.prototype.getConditionsText = function(){
	return this.arrow.conditions_text;
}

/**
 * setter delegates to arrow
 * @param{string} text
 */
kemia.model.Reaction.prototype.setConditionsText = function(text){
	this.arrow.setConditionsText(text);
}


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
// this.logger.info('removePlus');
	goog.array.remove(this.pluses, plus);
	plus.reaction = undefined;
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
 * bounding box of an array of molecules
 * 
 * @param {Array.
 *            <kemia.model.Molecule>} molecules
 * @return {goog.math.Box}
 */
kemia.model.Reaction.boundingBox = function(molecules) {
	var atoms = goog.array.flatten(goog.array.map(molecules, function(mol) {
		return mol.atoms;
	}));
	var coords = goog.array.map(atoms, function(a) {
		return a.coord;
	})
	if(coords.length>0){
		return goog.math.Box.boundingBox.apply(null, coords);
	} else {
		return null
	}
};

/**
 * finds center of an array of molecules
 * 
 * @param {Array.
 *            <kemia.model.Molecule>} molecules
 * @return goog.math.Coordinate
 */
kemia.model.Reaction.prototype.center = function(molecules) {
	var bbox = kemia.model.Reaction.boundingBox(molecules);
	return new goog.math.Coordinate((bbox.left + bbox.right) / 2,
			(bbox.top + bbox.bottom) / 2);
};

/**
 * layout molecules to eliminate any molecule overlap plus a margin
 */
kemia.model.Reaction.removeOverlap = function(molecules) {
	var accumulated_rect;
	// order molecules left-to-right
	goog.array.sort(
			molecules, function(m1, m2){
				return goog.array.defaultCompare(
						m1.getBoundingBox().left, 
						m2.getBoundingBox().left)});
	goog.array.forEach(molecules,
			function(mol) {
		var mol_rect = goog.math.Rect.createFromBox(this
				.boundingBox( [ mol ]));
		if (accumulated_rect) {
			if (goog.math.Rect.intersection(accumulated_rect,
					mol_rect)) {
				mol.translate(
						new goog.math.Coordinate(kemia.model.Reaction.MOLECULE_MARGIN 
								+ accumulated_rect.left
								+ accumulated_rect.width
								- mol_rect.left, 0));
			}
			// expand to include this molecule location
			accumulated_rect.boundingRect(goog.math.Rect
					.createFromBox(kemia.model.Reaction.boundingBox( [ mol ])));
		} else {
			accumulated_rect = mol_rect;
		}
	}, this);
	return molecules;
};




