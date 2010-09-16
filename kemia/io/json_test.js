goog.require('goog.testing.jsunit');
goog.require('kemia.io.json');
goog.require('goog.json.Serializer');
goog.require('goog.debug.Console');
goog.require('goog.debug.Logger');

var rxn;
var mol;
function setUp() {
	var c = new goog.debug.Console();
	c.setCapturing(true);
	logger = goog.debug.Logger.getLogger('JsonTest');

}

function testReadWriteMolecule() {
	var mol = kemia.io.json.readMolecule(jmol);
	assertEquals('test', mol.name);
	assertEquals(26, mol.countAtoms());
	assertEquals(27, mol.countBonds());

	var moljson = kemia.io.json.moleculeToJson(mol);
	var mol2 = kemia.io.json.readMolecule(moljson);
	 assertEquals(mol.name,"test");
	 assertEquals(mol.countAtoms(), 26);
	 assertEquals(mol.countBonds(), 27);
}

function testReadMoleculeAromatic() {
	var mol = kemia.io.json.readMolecule(jmol2);
	assertEquals(mol.name, "test");
	assertEquals(mol.countAtoms(), 26);
	assertEquals(mol.countBonds(), 27);
}

function test1ExportMol() {
	var mol = kemia.io.json.readMolecule(jmol);
	var jmolstr = kemia.io.json.writeMolecule(mol);

	// test the string representation
	var mol2 = kemia.io.json.readMolecule(jmolstr);
	assertEquals('test', mol2.name);
	assertEquals(26, mol2.countAtoms());
	assertEquals(27, mol2.countBonds());
	
}

function test2ImportReaction() {
	rxn = kemia.io.json.readReaction(jreaction);
	assertEquals("3-component UGI", rxn.getHeader());
	assertEquals(rxn.reactants.length, 3);
	assertEquals(rxn.reactants[1].name, "isocyanoethane");
	assertEquals(rxn.reactants[1].countAtoms(), 4);
	assertEquals(rxn.products[0].countBonds(), 15);
	assertEquals(rxn.products.length, 1);
	// test the string representation
	rxn = kemia.io.json.readReaction(JSON.stringify(jreaction));
	assertEquals(rxn.header, "3-component UGI");
	assertEquals(rxn.reactants.length, 3);
	assertEquals(rxn.reactants[1].name, "isocyanoethane");
	assertEquals(rxn.reactants[1].countAtoms(), 4);
	assertEquals(rxn.products[0].countBonds(), 15);
	assertEquals(rxn.products.length, 1);
	assertEquals('foo reagent', rxn.reagentsText);
	assertEquals('bar conditions', rxn.conditionsText);
}

function test3ExportReaction() {
	var rxn = kemia.io.json.readReaction(jreaction);
	var jrxnstr = kemia.io.json.writeReaction(rxn);
	assertEquals(3973, jrxnstr.length);
	// test the string representation
	var rxn = kemia.io.json.readReaction(JSON.stringify(jreaction));
	var jrxnstr = kemia.io.json.writeReaction(rxn);
	assertEquals(3973, jrxnstr.length);

}

function test4ReactionToJson() {
	var rxn = kemia.io.json.readReaction(reactionDrawing);
	var rxn_json = kemia.io.json.reactionToJson(rxn);
	assertEquals(rxn.reactants.length, rxn_json.reactants.length);
	assertEquals(rxn.products.length, rxn_json.products.length);
	assertEquals(rxn.reactants[0].countAtoms(),
			rxn_json.reactants[0].atoms.length);
	assertEquals('foo reagent', rxn_json.reagents_text);
	assertEquals('bar conditions', rxn_json.conditions_text);
};