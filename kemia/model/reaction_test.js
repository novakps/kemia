goog.require('kemia.model.Reaction');
goog.require('goog.testing.jsunit');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');

function setUp() {
	c = new goog.debug.Console();
	c.setCapturing(true);
	logger = goog.debug.Logger.getLogger('ReactionTest');

}

var testRemoveOverlap = function() {
	var mol1 = new kemia.model.Molecule();
	mol1.addAtom(new kemia.model.Atom("C", -1, -1));
	mol1.addAtom(new kemia.model.Atom("C", 1, 1));
	logger.info('mol1 ' + mol1.getBoundingBox().toString());

	var mol2 = new kemia.model.Molecule();
	mol2.addAtom(new kemia.model.Atom("O", -2, -2));
	mol2.addAtom(new kemia.model.Atom("O", 0, 0));
	logger.info('mol2 ' + mol2.getBoundingBox().toString());

	var rxn = new kemia.model.Reaction();
	rxn.addReactant(mol1);
	rxn.addProduct(mol2);

	var bbox = rxn.boundingBox(goog.array.concat(rxn.reactants, rxn.products));
	logger.info('rxn bbox ' + bbox.toString());
	assertEquals(3, bbox.right - bbox.left);
	rxn.removeOverlap();
	bbox = rxn.boundingBox(goog.array.concat(rxn.reactants, rxn.products));
	logger.info('rxn bbox after remove overlap ' + bbox.toString());
	logger.info('mol1 ' + mol1.getBoundingBox().toString());
	logger.info('mol2 ' + mol2.getBoundingBox().toString());
	
	var bbox = rxn.boundingBox(goog.array.concat(rxn.reactants, rxn.products));
	assertEquals(2 + 2 + 4, bbox.right - bbox.left);

};