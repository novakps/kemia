goog.require('goog.testing.jsunit');
goog.require('kemia.controller.plugins.MoleculeEdit')
goog.require('kemia.model.Atom');
goog.require('kemia.model.Bond');
goog.require('kemia.model.Molecule');
goog.require('goog.debug.Logger');
goog.require('goog.debug.Console');

function setUp() {
	c = new goog.debug.Console();
	c.setCapturing(true);
	logger = goog.debug.Logger.getLogger('kemia.model.MoleculeEditTest');
}

function buildMolecule() {
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
	return mol1;
}

template_cyclopentane = {
	"name" : "cyclopentane",
	"atoms" : [ {
		"symbol" : "d",
		"coord" : {
			"x" : -2.3083,
			"y" : 0.4635,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "e",
		"coord" : {
			"x" : -2.3083,
			"y" : 1.9635,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "f",
		"coord" : {
			"x" : -0.8817,
			"y" : 2.427,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "g",
		"coord" : {
			"x" : 0,
			"y" : 1.2135,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "h",
		"coord" : {
			"x" : -0.8817,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 1,
		"target" : 0,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 1,
		"target" : 2,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 2,
		"target" : 3,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 3,
		"target" : 4,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 4,
		"target" : 0,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	} ]
};
