goog.require('goog.dom');
goog.require('kemia.controller.DefaultToolbar');
goog.require('kemia.controller.ReactionEditor');
goog.require('kemia.controller.Testdata');
goog.require('kemia.controller.ToolbarController');
goog.require('kemia.controller.plugins.ArrowPlusEdit');
goog.require('kemia.controller.plugins.AtomEdit');
goog.require('kemia.controller.plugins.BondEdit');
goog.require('kemia.controller.plugins.ClearEditor');
goog.require('kemia.controller.plugins.Erase');
goog.require('kemia.controller.plugins.MoleculeEdit');
goog.require('kemia.controller.plugins.Move');
goog.require('kemia.controller.plugins.UndoRedo');
goog.require('kemia.controller.plugins.Zoom');
goog.require('kemia.io.json');


function initPage() {
	var toolbar = kemia.controller.DefaultToolbar
			.makeDefaultReactionToolbar(goog.dom
					.getElement('reactionEditorToolbar'));

	var model = kemia.io.json.readReaction(kemia.controller.Testdata.reactionDrawing);

	var editor = new kemia.controller.ReactionEditor(goog.dom
			.getElement('reactionEditorContainer'), {
		background: {
			color: 'white'
		},
		showTerminalCarbons: false
	});
	
	// event listener that calls an alert
	editor.addEventListener(kemia.controller.ReactionEditor.EventType.CLEAR, 
		    function(e) { alert('Cleared!'); }); 

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


	editor.setModels([model]);
}
(function() {
	window.onload = function() {
		initPage();
		window.onload = null;
	};
})();
