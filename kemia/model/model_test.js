goog.provide('kemia.model.modelTest');
goog.require('goog.testing.jsunit');
goog.require('kemia.model.Molecule');
goog.require('kemia.model.Atom');
goog.require('kemia.model.Atom.Hybridizations');
goog.require('kemia.model.Bond');
goog.require('kemia.model.PseudoAtom');

var mol;

function setUp() {
}

function testAddAtom() {
	var mol = new kemia.model.Molecule;
	mol.addAtom(new kemia.model.Atom("C"));
	mol.addAtom(new kemia.model.Atom("C"));
	mol.addAtom(new kemia.model.Atom("N"));
	mol.addAtom(new kemia.model.Atom("O"));
	mol.addAtom(new kemia.model.Atom("Cl"));

	assertEquals(5, mol.countAtoms());
	assertEquals("N", mol.getAtom(2).symbol);
	assertEquals("O", mol.getAtom(3).symbol);
	assertEquals("Cl", mol.getAtom(4).symbol);

	assertEquals(2, mol.indexOfAtom(mol.getAtom(2)));
	assertEquals(0, mol.indexOfAtom(mol.getAtom(0)));

}

function testAddBond() {
	var mol = new kemia.model.Molecule;
	var atom1 = new kemia.model.Atom("C");
	var atom2 = new kemia.model.Atom("C");
	var atom3 = new kemia.model.Atom("C");
	var atom4 = new kemia.model.Atom("O");

	mol.addBond(new kemia.model.Bond(atom1, atom2));
	mol.addBond(new kemia.model.Bond(atom2, atom3));
	mol.addBond(new kemia.model.Bond(atom3, atom4));

	assertEquals(2, atom2.countBonds());

	assertEquals(1, atom1.countBonds());

	assertEquals(3, mol.countBonds());
}

function testRemoveAtom() {
	var mol = new kemia.model.Molecule;
	var atom1 = new kemia.model.Atom("C");
	var atom2 = new kemia.model.Atom("C");
	var atom3 = new kemia.model.Atom("C");
	var atom4 = new kemia.model.Atom("O");

	mol.addAtom(atom1);
	mol.addAtom(atom2);
	mol.addAtom(atom3);
	mol.addAtom(atom4);

	var bond1 = new kemia.model.Bond(atom1, atom2);
	var bond2 = new kemia.model.Bond(atom2, atom3);
	var bond3 = new kemia.model.Bond(atom3, atom4);

	mol.addBond(bond1);
	mol.addBond(bond2);
	mol.addBond(bond3);

	assertEquals(4, mol.countAtoms());

	mol.removeAtom(atom2);

	assertEquals(1, mol.countBonds());

	assertEquals(3, mol.countAtoms());

	mol.removeAtom(0);

	assertEquals(2, mol.countAtoms());

}

function testRemoveBond() {
	var mol = new kemia.model.Molecule;
	var atom1 = new kemia.model.Atom("C");
	var atom2 = new kemia.model.Atom("C");
	var atom3 = new kemia.model.Atom("C");
	var atom4 = new kemia.model.Atom("O");

	mol.addAtom(atom1);
	mol.addAtom(atom2);
	mol.addAtom(atom3);
	mol.addAtom(atom4);

	var bond1 = new kemia.model.Bond(atom1, atom2);
	var bond2 = new kemia.model.Bond(atom2, atom3);
	var bond3 = new kemia.model.Bond(atom3, atom4);

	mol.addBond(bond1);
	mol.addBond(bond2);
	mol.addBond(bond3);

	assertEquals(3, mol.countBonds());

	mol.removeBond(bond3);
	assertEquals(false, atom3.bonds.contains(bond3));
	assertEquals(2, mol.countBonds());

	mol.removeBond(0);
	assertEquals(1, mol.countBonds());
}

function testPseudoAtom() {
	var mol = new kemia.model.Molecule;
	var pseudoAtom = new kemia.model.PseudoAtom();
	assertEquals("R", pseudoAtom.symbol);
	assertEquals("*", pseudoAtom.label);
}

function testHybridization() {
	var mol = new kemia.model.Molecule;
	var atom = new kemia.model.Atom("C");
	atom.hybridization = kemia.model.Atom.Hybridizations.SP2;
	assertEquals(kemia.model.Atom.Hybridizations.SP2, atom.hybridization);
}

//function testImplicitHydrogenCountAromatic() {
//
//	var mol = new kemia.model.Molecule;
//	var atom1 = new kemia.model.Atom("C");
//	var atom2 = new kemia.model.Atom("C");
//	var atom3 = new kemia.model.Atom("C");
//	var atom4 = new kemia.model.Atom("C");
//	var atom5 = new kemia.model.Atom("C");
//	var atom6 = new kemia.model.Atom("C");
//
//	mol.addBond(new kemia.model.Bond(atom1, atom2));
//	mol.addBond(new kemia.model.Bond(atom2, atom3));
//	mol.addBond(new kemia.model.Bond(atom3, atom4));
//	mol.addBond(new kemia.model.Bond(atom4, atom5));
//	mol.addBond(new kemia.model.Bond(atom5, atom6));
//	mol.addBond(new kemia.model.Bond(atom6, atom1));
//
//	mol.bonds[0].aromatic = true;
//	mol.bonds[1].aromatic = true;
//	mol.bonds[2].aromatic = true;
//	mol.bonds[3].aromatic = true;
//	mol.bonds[4].aromatic = true;
//	mol.bonds[5].aromatic = true;
//
//	assertEquals(1, atom1.hydrogenCount());
//	assertEquals(1, atom2.hydrogenCount());
//	assertEquals(1, atom3.hydrogenCount());
//}

function testImplicitHydrogenCount() {

	var mol = new kemia.model.Molecule;
	var atom1 = new kemia.model.Atom("C");
	var atom2 = new kemia.model.Atom("C");
	var atom3 = new kemia.model.Atom("C");
	var atom4 = new kemia.model.Atom("C");

	mol.addBond(new kemia.model.Bond(atom1, atom2));
	mol.addBond(new kemia.model.Bond(atom2, atom3));
	mol.bonds[mol.bonds.length - 1].stereo = 'up';
	mol.addBond(new kemia.model.Bond(atom3, atom4, 2));

	assertEquals(3, atom1.hydrogenCount());
	assertEquals(2, atom2.hydrogenCount());
	assertEquals(1, atom3.hydrogenCount());
}