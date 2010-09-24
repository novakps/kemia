goog.require('goog.testing.jsunit');
goog.require('kemia.io.mdl');

var mdl;
var sdfs;
function setUp() {
	sdfs = sdf.split("$$$$\n");
	molfile = sdfs[3];
}

function testReadMolfile() {
	var mol = kemia.io.mdl.readMolfile(molfile);
	assertEquals(45, mol.countAtoms());
	assertEquals(44, mol.countBonds());

	var bondToTest = mol.getBond(43);

	assertTrue(bondToTest instanceof kemia.model.Bond);
	assertEquals(1, bondToTest.order);
	assertEquals(mol.getAtom(19), bondToTest.source);
	assertEquals(mol.indexOfAtom(bondToTest.source), 19);
	assertEquals(mol.getAtom(27), bondToTest.target);
	assertEquals(mol.indexOfAtom(bondToTest.target), 27);
}

function testWriteMolfile() {
	var mol = kemia.io.mdl.readMolfile(molfile);

	var molfile2 = kemia.io.mdl.writeMolfile(mol);

	var mol2 = kemia.io.mdl.readMolfile(molfile2);
	var molfile3 = kemia.io.mdl.writeMolfile(mol2);
	assertEquals(molfile2, molfile3);

}

function testReadRxnfile() {
	var reaction = kemia.io.mdl.readRxnfile(rxnsample);
	assertEquals(2, reaction.getReactants().length);
	assertEquals(1, reaction.getProducts().length);
}

function testReadWriteReadRxnfile() {
	var reaction1 = kemia.io.mdl.readRxnfile(rxnsample);
	var rxn_string = kemia.io.mdl.writeRxnfile(reaction1);
	var reaction2 = kemia.io.mdl.readRxnfile(rxn_string);
	assertEquals(reaction1.getReactants().length, reaction2.getReactants().length);
	assertEquals(reaction1.getProducts().length, reaction2.getProducts().length);
}
