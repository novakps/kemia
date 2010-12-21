goog.require('kemia.controller.ReactionEditor');
goog.require('goog.events.EventType');
goog.require('goog.dom');
goog.require('goog.debug.Console');
goog.require('kemia.layout.CoordinateGenerator');
goog.require('goog.ui.Select');
goog.require('kemia.io.smiles.SmilesParser');
goog.require('kemia.io.mdl');
goog.require('kemia.io.json');
goog.require('kemia.ring.testdata.AlphaPinene');
goog.require('kemia.ring.testdata.Azulene');
goog.require('kemia.ring.testdata.Biphenyl');
goog.require('kemia.ring.testdata.SpiroDecane');

function draw() {
	var renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('alpha_pinene1'), {
		background : {
			color : 'white'
		}
	});
	var mol = kemia.io.mdl.readMolfile(kemia.ring.testdata.AlphaPinene);
	renderer.setModels([ mol ]);

	renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('alpha_pinene2'), {
		background : {
			color : 'white'
		}
	});
	goog.array.forEach(mol.atoms, function(atom) {
		atom.coord = new goog.math.Coordinate(0, 0);
	});
	try {
		mol = kemia.layout.CoordinateGenerator.generate(mol);
		mol.mustRecalcSSSR = true;
		renderer.setModels([ mol ]);
	} catch (e) {
		console.log(e);
	}

	renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('azulene1'), {
		background : {
			color : 'white'
		}
	});
	var mol = kemia.io.mdl.readMolfile(kemia.ring.testdata.Azulene);
	renderer.setModels([ mol ]);

	renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('azulene2'), {
		background : {
			color : 'white'
		}
	});
	goog.array.forEach(mol.atoms, function(atom) {
		atom.coord = new goog.math.Coordinate(0, 0);
	});
	try {
		mol = kemia.layout.CoordinateGenerator.generate(mol);
		mol.mustRecalcSSSR = true;
		renderer.setModels([ mol ]);
	} catch (e) {
		console.log(e);
	}

	renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('biphenyl1'), {
		background : {
			color : 'white'
		}
	});
	var mol = kemia.io.mdl.readMolfile(kemia.ring.testdata.Biphenyl);
	renderer.setModels([ mol ]);

	renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('biphenyl2'), {
		background : {
			color : 'white'
		}
	});
	goog.array.forEach(mol.atoms, function(atom) {
		// atom.symbol = atom.symbol + atom.index;
		atom.coord = new goog.math.Coordinate(0, 0);
	});
	try {
		mol = kemia.layout.CoordinateGenerator.generate(mol);
		mol.mustRecalcSSSR = true;
		renderer.setModels([ mol ]);
	} catch (e) {
		console.log(e);
	}

	renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('spiro_decane1'), {
		background : {
			color : 'white'
		}
	});
	var mol = kemia.io.mdl.readMolfile(kemia.ring.testdata.SpiroDecane);
	renderer.setModels([ mol ]);

	renderer = new kemia.controller.ReactionEditor(goog.dom
			.getElement('spiro_decane2'), {
		background : {
			color : 'white'
		}
	});
	goog.array.forEach(mol.atoms, function(atom) {
		atom.coord = new goog.math.Coordinate(0, 0);
	});
	try {
		mol = kemia.layout.CoordinateGenerator.generate(mol);
		mol.mustRecalcSSSR = true;
		renderer.setModels([ mol ]);
	} catch (e) {
		console.log(e);
	}

}
