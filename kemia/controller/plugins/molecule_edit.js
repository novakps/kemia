goog.provide('kemia.controller.plugins.MoleculeEdit');
goog.require('kemia.controller.Plugin');
goog.require('goog.debug.Logger');
goog.require('kemia.model.Molecule');

/**
 * @constructor
 * @extends{kemia.controller.Plugin}s
 */
kemia.controller.plugins.MoleculeEdit = function() {
	kemia.controller.Plugin.call(this);

}
goog.inherits(kemia.controller.plugins.MoleculeEdit, kemia.controller.Plugin);
goog.exportSymbol('kemia.controller.plugins.MoleculeEdit', kemia.controller.plugins.MoleculeEdit);
/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.MoleculeEdit.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.MoleculeEdit');
/**
 * Command implemented by this plugin.
 */
kemia.controller.plugins.MoleculeEdit.COMMAND = 'selectMoleculeTemplate';

/** @inheritDoc */
kemia.controller.plugins.MoleculeEdit.prototype.isSupportedCommand = function(
		command) {
	return command == kemia.controller.plugins.MoleculeEdit.COMMAND;
};

/** @inheritDoc */
kemia.controller.plugins.MoleculeEdit.prototype.getTrogClassId = goog.functions
		.constant(kemia.controller.plugins.MoleculeEdit.COMMAND);

/**
 * sets template
 * 
 * @param {string}
 *            command Command to execute.
 * @return {Object|undefined} The result of the command.
 */
kemia.controller.plugins.MoleculeEdit.prototype.execCommandInternal = function(
		command, var_args) {
	this.template = arguments[1];
	var e = arguments[3];
	var molecule = kemia.io.json.readMolecule(this.template);
	// place template as new molecule at 0,0 of graphics canvas
	var origin = this.editorObject.getAtomicCoords(new goog.math.Coordinate(0,
			0));
	var mol_bbox = molecule.getBoundingBox();
	var mol_offset = new goog.math.Coordinate(mol_bbox.right, mol_bbox.top);
	var diff = goog.math.Coordinate.difference(origin, mol_offset);
	// diff = goog.math.Coordinate.difference(diff, mol_offset);
	if (this.editorObject.getModels().length > 0) {
		var reaction = this.editorObject.getModels()[0];
	} else {
		reaction = new kemia.model.Reaction();
	}
	reaction.addReactant(molecule);
	reaction.translateMolecule(molecule, diff);
	this.editorObject.setModels( [ reaction ]);
	var mol_center = molecule.getCenter();

	var center = this.editorObject.getGraphicsCoords(mol_center);
	var origin = kemia.controller.ReactionEditor.getOffsetCoords(
			this.editorObject.originalElement, document.body.scrollLeft
			+ document.documentElement.scrollLeft, document.body.scrollTop
			+ document.documentElement.scrollTop);

	e.clientX = center.x - origin.x;
	e.clientY = center.y - origin.y;

	this.dragTemplate(e, molecule);
};

kemia.controller.plugins.MoleculeEdit.prototype.dragTemplate = function(e,
		molecule) {

	var d = new goog.fx.Dragger(this.editorObject.getOriginalElement());
	d._start = new goog.math.Coordinate(e.clientX, e.clientY);
	d._prev = d._start;
	d.molecule = molecule;
	d.editor = this.editorObject;
	d
			.addEventListener(goog.fx.Dragger.EventType.DRAG,
					function(e) {
						if (d._highlightGroups) {
							goog.array.forEach(d._highlightGroups, function(g) {
								g.clear();
							})
						}
						d._highlightGroups = [];
						var mouse_coord = new goog.math.Coordinate(e.clientX,
								e.clientY);

						var diff = goog.math.Coordinate.difference(mouse_coord,
								d._start);

						// move graphic
					d.molecule.group.setTransformation(diff.x, diff.y, 0, 0, 0);

					// move molecule
					var mol_coords = d.editor.reactionRenderer.transform
							.createInverse().transformCoords(
									[ mouse_coord, d._prev ]);

					var diff = goog.math.Coordinate.difference(mol_coords[0],
							mol_coords[1]);
					d.molecule.reaction.translateMolecule(d.molecule, diff);
					d._prev = mouse_coord;

					// highlight merge sites
					var merge_pairs = this.findAtomMergePairs(molecule);

					// only first merge pair for now
					if (merge_pairs.length > 0) {
						merge_pairs = [ merge_pairs[0] ];
					}
					goog.array
							.forEach(
									merge_pairs,
									function(pair) {
										d._highlightGroups
												.push(d.editor.reactionRenderer.moleculeRenderer.atomRenderer
														.highlightOn(pair[0]));
										d._highlightGroups
												.push(d.editor.reactionRenderer.moleculeRenderer.atomRenderer
														.highlightOn(pair[1]));
									});

				}, undefined, this);
	d.addEventListener(goog.fx.Dragger.EventType.END, function(e) {
		var merge_pairs = this.findAtomMergePairs(d.molecule);

		// only first merge pair for now
			if (merge_pairs.length > 0) {
				merge_pairs = [ merge_pairs[0] ];
			}
			goog.array.forEach(merge_pairs, function(pair) {
				kemia.controller.plugins.AtomEdit.mergeMolecules(pair[0],
						pair[1]);
			}, this);
			d.editor.setModels(d.editor.getModels());
			d.dispose();
		}, undefined, this);
	d.startDrag(e);
};

/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.MoleculeEdit.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.MoleculeEdit');

kemia.controller.plugins.MoleculeEdit.prototype.handleMouseDown = function(e) {

	// if (this.isActive) {
	this.editorObject.dispatchBeforeChange();
	var target = this.editorObject.findTarget(e);

	this.editorObject.dispatchChange();
	// }
};


/**
 * reset to default state
 * called when another plugin is made active
 */
kemia.controller.plugins.MoleculeEdit.prototype.resetState = function(){
	this.template  = undefined;
}


/** @inheritDoc */
kemia.controller.plugins.MoleculeEdit.prototype.queryCommandValue = function(command) {
	if (command == kemia.controller.plugins.MoleculeEdit.COMMAND) {
		return this.template;
	}
};

/**
 * @enum {Object}
 */
kemia.controller.plugins.MoleculeEdit.TEMPLATES = [ {
	"name" : "benzene",
	"atoms" : [ {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 1.30,
			"y" : 3.0,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 1.30,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 0,
		"target" : 1,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 1,
		"target" : 2,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 2,
		"target" : 3,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 3,
		"target" : 4,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 4,
		"target" : 5,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 5,
		"target" : 0,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	} ]
}, {
	"name" : "cyclohexane",
	"atoms" : [ {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 1.30,
			"y" : 3.0,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 1.30,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 0,
		"target" : 1,
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
		"target" : 5,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 5,
		"target" : 0,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	} ]
}, {
	"name" : "cyclopentane",
	"atoms" : [ {
		"symbol" : "C",
		"coord" : {
			"x" : -2.3083,
			"y" : 0.4635,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : -2.3083,
			"y" : 1.9635,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : -0.8817,
			"y" : 2.427,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 1.2135,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : -0.8817,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 0,
		"target" : 1,
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
}, {
	"name" : "cyclopentane",
	"atoms" : [ {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 1.30,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 0,
		"target" : 1,
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
}, {
	"name" : "pyrrole",
	"atoms" : [ {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "N",
		"coord" : {
			"x" : 1.30,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 0,
		"target" : 1,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 1,
		"target" : 2,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 2,
		"target" : 3,
		"type" : "DOUBLE_BOND",
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
}, {
	"name" : "pyrrole",
	"atoms" : [ {
		"symbol" : "C",
		"coord" : {
			"x" : -2.3083,
			"y" : 0.4635,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : -2.3083,
			"y" : 1.9635,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : -0.8817,
			"y" : 2.427,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 1.2135,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "N",
		"coord" : {
			"x" : -0.8817,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 0,
		"target" : 1,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 1,
		"target" : 2,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 2,
		"target" : 3,
		"type" : "DOUBLE_BOND",
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
}, {
	"name" : "naphthalene",
	"atoms" : [ {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 2.5981,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 1.2991,
			"y" : 3,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 0,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 1.2991,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 3.8971,
			"y" : 3,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 5.1962,
			"y" : 2.25,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 5.1962,
			"y" : 0.75,
			"z" : 0
		},
		"charge" : 0
	}, {
		"symbol" : "C",
		"coord" : {
			"x" : 3.8971,
			"y" : 0,
			"z" : 0
		},
		"charge" : 0
	} ],
	"bondindex" : [ {
		"source" : 0,
		"target" : 1,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 1,
		"target" : 2,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 2,
		"target" : 3,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 3,
		"target" : 4,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 4,
		"target" : 5,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 5,
		"target" : 0,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 1,
		"target" : 6,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 6,
		"target" : 7,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 7,
		"target" : 8,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 8,
		"target" : 9,
		"type" : "DOUBLE_BOND",
		"stereo" : "NOT_STEREO"
	}, {
		"source" : 9,
		"target" : 0,
		"type" : "SINGLE_BOND",
		"stereo" : "NOT_STEREO"
	} ]
} ];
