goog.require('goog.testing.jsunit');
goog.require('kemia.model.Molecule');
goog.require('kemia.model.Atom');
goog.require('kemia.model.Bond');
goog.require('goog.debug.Trace');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');

function setUp() {
	c = new goog.debug.Console();
	c.setCapturing(true);
	logger = goog.debug.Logger.getLogger('kemia.model.MoleculeTest');
}

function testMerge() {
	var mol1 = new kemia.model.Molecule('mol1');
	var a1a = new kemia.model.Atom('a', 0, 1);
	var a1b = new kemia.model.Atom('b', 0, 2);
	var a1c = new kemia.model.Atom('c', 0, 3);
	var b1a = new kemia.model.Bond(a1a, a1b);
	var b1b = new kemia.model.Bond(a1b, a1c);
	mol1.addAtom(a1a);
	mol1.addAtom(a1b);
	mol1.addAtom(a1c);
	mol1.addBond(b1a);
	mol1.addBond(b1b);

	var mol2 = new kemia.model.Molecule('mol2');
	var a2a = new kemia.model.Atom('d', 2, 1);
	var a2b = new kemia.model.Atom('e', 2, 2);
	var a2c = new kemia.model.Atom('f', 2, 3);
	var b2a = new kemia.model.Bond(a2a, a2b);
	var b2b = new kemia.model.Bond(a2b, a2c);
	mol2.addAtom(a2a);
	mol2.addAtom(a2b);
	mol2.addAtom(a2c);
	mol2.addBond(b2a);
	mol2.addBond(b2b);
	
	this.logger.info(mol1.toString());
	this.logger.info(mol2.toString());
	mol1.merge(mol2, b2a, b1b, a2a, a1c);
	this.logger.info(mol1.toString());
	
	assertEquals(4, mol1.atoms.length);
	assertEquals(3, mol1.bonds.length);
	
}