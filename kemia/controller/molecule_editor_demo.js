goog.require('goog.events.EventType');
goog.require('goog.dom');
goog.require('goog.ui.Select');
goog.require('goog.ui.MenuItem');
goog.require('kemia.io.json');
goog.require('kemia.controller.DefaultToolbar');
goog.require('kemia.controller.ToolbarController');
goog.require('kemia.controller.plugins.Move');
goog.require('kemia.controller.plugins.ClearEditor');
goog.require('kemia.controller.plugins.Zoom');
goog.require('kemia.controller.plugins.UndoRedo');
goog.require('kemia.controller.plugins.AtomEdit');
goog.require('kemia.controller.plugins.BondEdit');
goog.require('kemia.controller.plugins.ArrowPlusEdit');
goog.require('kemia.controller.plugins.Erase');
goog.require('kemia.controller.plugins.MoleculeEdit');
goog.require('kemia.io.Testdata');
goog.require('kemia.io.mdl');
goog.require('kemia.io.smiles.SmilesParser');
goog.require('goog.debug.Console');

var controller;

function initPage() {
	// uncomment next two lines to debug to console
	var c = new goog.debug.Console();
	c.setCapturing(true);

	var toolbar = kemia.controller.DefaultToolbar
			.makeDefaultMoleculeToolbar(goog.dom
					.getElement('moleculeEditorToolbar'));

	var editor = new kemia.controller.ReactionEditor(goog.dom
			.getElement('moleculeEditorContainer'), {
		background : {
			color : 'white'
		}
	});

	editor.registerPlugin(new kemia.controller.plugins.Move());
	editor.registerPlugin(new kemia.controller.plugins.ClearEditor());
	editor.registerPlugin(new kemia.controller.plugins.Zoom());
	editor.registerPlugin(new kemia.controller.plugins.UndoRedo());
	editor.registerPlugin(new kemia.controller.plugins.Erase());
	editor.registerPlugin(new kemia.controller.plugins.AtomEdit());
	editor.registerPlugin(new kemia.controller.plugins.BondEdit());
	editor.registerPlugin(new kemia.controller.plugins.ArrowPlusEdit());
	editor.registerPlugin(new kemia.controller.plugins.MoleculeEdit());


	var toolbarController = new kemia.controller.ToolbarController(editor,
			toolbar);

	var sdfs = kemia.io.Testdata.sdf.split("$$$$\n");
	editor.setModels([ kemia.io.mdl.readMolfile(sdfs[0]) ]);

	var select1 = new goog.ui.Select();
	select1.addItem(new goog.ui.MenuItem('0', 0));
	select1.addItem(new goog.ui.MenuItem('1', 1));
	select1.addItem(new goog.ui.MenuItem('2', 2));
	select1.addItem(new goog.ui.MenuItem('3 (bucky ball)', 3));
	select1.addItem(new goog.ui.MenuItem('4', 4));
	select1.addItem(new goog.ui.MenuItem('5', 5));
	select1.addItem(new goog.ui.MenuItem('6', 6));
	select1.addItem(new goog.ui.MenuItem('7', 7));
	select1.addItem(new goog.ui.MenuItem('8', 8));
	select1.addItem(new goog.ui.MenuItem('9', 9));
	select1.addItem(new goog.ui.MenuItem('10', 10));
	select1.addItem(new goog.ui.MenuItem('11 (not too large any more!)', 11));
	select1.addItem(new goog.ui.MenuItem('12', 12));

	select1.setSelectedIndex(0);
	select1.render(goog.dom.getElement('selectMolecule'));

	goog.events.listen(select1, goog.ui.Component.EventType.ACTION,
			function(e) {
				var select = e.target;
				var idx = select.getValue();
				var molfile = sdfs[idx];
				var mol = kemia.io.mdl.readMolfile(molfile);
				editor.setModels([ mol ]);
			});

};

(function(){
    var onload = window.onload;
    window.onload = function() {
    	initPage();
      window.onload = null;
    };
})();
