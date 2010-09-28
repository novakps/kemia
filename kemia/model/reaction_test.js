goog.require('kemia.model.Reaction');
goog.require('kemia.model.Bond');
goog.require('kemia.model.Plus');
goog.require('goog.math.Coordinate');
goog.require('goog.testing.jsunit');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');

function setUp() {
	c = new goog.debug.Console();
	c.setCapturing(true);
	logger = goog.debug.Logger.getLogger('ReactionTest');
}

function buildReaction() {
	var rxn1 = new kemia.model.Reaction();
	rxn1.header = 'my header';
	rxn1.reagentsText = 'my reagents';
	rxn1.conditionsText = 'my conditions';
	var mol1 = new kemia.model.Molecule('mol1');
	var a1a = new kemia.model.Atom('C', 0, 1);
	var a1b = new kemia.model.Atom('C', 0, 2);
	var b1 = new kemia.model.Bond(a1a, a1b);
	mol1.addAtom(a1a);
	mol1.addAtom(a1a);
	mol1.addBond(b1);
	rxn1.addMolecule(mol1);

	rxn1.addPlus(new kemia.model.Plus(new goog.math.Coordinate(1, 1.5)));

	var mol2 = new kemia.model.Molecule('mol2');
	var a2a = new kemia.model.Atom('C', 2, 1);
	var a2b = new kemia.model.Atom('C', 2, 2);
	var b2 = new kemia.model.Bond(a2a, a2b);
	mol2.addAtom(a2a);
	mol2.addAtom(a2b);
	mol2.addBond(b2);
	rxn1.addMolecule(mol2);

	rxn1.setArrow(new kemia.model.Arrow(new goog.math.Coordinate(3, 1.5),
			new goog.math.Coordinate(4, 1.5)));

	var mol3 = new kemia.model.Molecule('mol3');
	var a3a = new kemia.model.Atom('C', 4, 1);
	var a3b = new kemia.model.Atom('C', 4, 2);
	var b3 = new kemia.model.Bond(a3a, a3b);
	mol3.addAtom(a3a);
	mol3.addAtom(a3b);
	mol3.addBond(b3);
	rxn1.addMolecule(mol3);
	return rxn1;
}

function buildReaction2() {
	// same as above with reactants in reverse order
	var rxn1 = new kemia.model.Reaction();

	var mol2 = new kemia.model.Molecule('mol2');
	var a2a = new kemia.model.Atom('C', 2, 1);
	var a2b = new kemia.model.Atom('C', 2, 2);
	var b2 = new kemia.model.Bond(a2a, a2b);
	mol2.addAtom(a2a);
	mol2.addAtom(a2b);
	mol2.addBond(b2);
	rxn1.addMolecule(mol2);
	rxn1.header = 'my header';
	rxn1.reagentsText = 'my reagents';
	rxn1.conditionsText = 'my conditions';
	var mol1 = new kemia.model.Molecule('mol1');
	var a1a = new kemia.model.Atom('C', 0, 1);
	var a1b = new kemia.model.Atom('C', 0, 2);
	var b1 = new kemia.model.Bond(a1a, a1b);
	mol1.addAtom(a1a);
	mol1.addAtom(a1a);
	mol1.addBond(b1);
	rxn1.addMolecule(mol1);

	rxn1.addPlus(new kemia.model.Plus(new goog.math.Coordinate(1, 1.5)));


	rxn1.setArrow(new kemia.model.Arrow(new goog.math.Coordinate(3, 1.5),
			new goog.math.Coordinate(4, 1.5)));

	var mol3 = new kemia.model.Molecule('mol3');
	var a3a = new kemia.model.Atom('C', 4, 1);
	var a3b = new kemia.model.Atom('C', 4, 2);
	var b3 = new kemia.model.Bond(a3a, a3b);
	mol3.addAtom(a3a);
	mol3.addAtom(a3b);
	mol3.addBond(b3);
	rxn1.addMolecule(mol3);
	return rxn1;
}

function testAddReactantLeftOfArrow() {
	var r = buildReaction();
	var mol_left = new kemia.model.Molecule('mol_left');
	var a1a = new kemia.model.Atom('C', 0, 1);
	var a1b = new kemia.model.Atom('C', 0, 2);
	var b1 = new kemia.model.Bond(a1a, a1b);
	mol_left.addAtom(a1a);
	mol_left.addAtom(a1a);
	mol_left.addBond(b1);
	r.addReactant(mol_left);
	assertEquals(3, r.getReactants().length);
}

function testAddReactantRightOfArrow() {
	var r = buildReaction();
	var mol_right = new kemia.model.Molecule('mol_right');
	var a3a = new kemia.model.Atom('C', 4, 1);
	var a3b = new kemia.model.Atom('C', 4, 2);
	var b3 = new kemia.model.Bond(a3a, a3b);
	mol_right.addAtom(a3a);
	mol_right.addAtom(a3b);
	mol_right.addBond(b3);
	r.addReactant(mol_right);
	assertEquals(3, r.getReactants().length);
}

function testAddProductLeftOfArrow() {
	var r = buildReaction();
	var mol_left = new kemia.model.Molecule('mol_left');
	var a1a = new kemia.model.Atom('C', 0, 1);
	var a1b = new kemia.model.Atom('C', 0, 2);
	var b1 = new kemia.model.Bond(a1a, a1b);
	mol_left.addAtom(a1a);
	mol_left.addAtom(a1a);
	mol_left.addBond(b1);
	r.addProduct(mol_left);
	assertEquals(2, r.getProducts().length);
}

function testAddProductRightOfArrow() {
	var r = buildReaction();
	var mol_right = new kemia.model.Molecule('mol_right');
	var a3a = new kemia.model.Atom('C', 4, 1);
	var a3b = new kemia.model.Atom('C', 4, 2);
	var b3 = new kemia.model.Bond(a3a, a3b);
	mol_right.addAtom(a3a);
	mol_right.addAtom(a3b);
	mol_right.addBond(b3);
	r.addProduct(mol_right);
	assertEquals(2, r.getProducts().length);
}

function testGetReactants() {
	var r = buildReaction();
	assertEquals(2, r.getReactants().length);
}

function testGetProducts() {
	var r = buildReaction();
	assertEquals(1, r.getProducts().length);
}

function testRemoveOverlap() {
	var mol1 = new kemia.model.Molecule('mol1');
	mol1.addAtom(new kemia.model.Atom("C", -1, -1));
	mol1.addAtom(new kemia.model.Atom("C", 1, 1));
	logger.info('mol1 ' + mol1.getBoundingBox().toString());

	var mol2 = new kemia.model.Molecule('mol2');
	mol2.addAtom(new kemia.model.Atom("O", -2, -2));
	mol2.addAtom(new kemia.model.Atom("O", 0, 0));
	logger.info('mol2 ' + mol2.getBoundingBox().toString());

	var rxn = new kemia.model.Reaction();
	rxn.addMolecule(mol1);
	rxn.addMolecule(mol2);

	var bbox = kemia.model.Reaction.boundingBox(rxn.molecules);
	logger.info('rxn bbox ' + bbox.toString());
	assertEquals(3, bbox.right - bbox.left);
	kemia.model.Reaction.removeOverlap(rxn.molecules);
	bbox = kemia.model.Reaction.boundingBox(rxn.molecules);
	logger.info('rxn bbox after remove overlap ' + bbox.toString());
	logger.info('mol1 ' + mol1.getBoundingBox().toString());
	logger.info('mol2 ' + mol2.getBoundingBox().toString());

	var bbox = kemia.model.Reaction.boundingBox(rxn.molecules);
	assertEquals(2 + 2 + 4, bbox.right - bbox.left);
};

function testMidpoint() {
	var rxn = buildReaction();
	var r = rxn.getReactants()[1];
	var p = rxn.getProducts()[0];
	var m = kemia.model.Reaction.midpoint(r,p);
	assertEquals(3, m.x);
	assertEquals(1.5, m.y);
}

function testCenterArrow(){
	var rxn = buildReaction();
	rxn.centerArrow();
	var c = rxn.arrow.getCenter();
	assertEquals(3, c.x);
	assertEquals(1.5, c.y);
}

function testCenterArrow2(){
	var rxn = buildReaction2();
	rxn.centerArrow();
	var c = rxn.arrow.getCenter();
	assertEquals(3, c.x);
	assertEquals(1.5, c.y);
}