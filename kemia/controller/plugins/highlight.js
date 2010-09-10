goog.provide('kemia.controller.plugins.Highlight');

goog.require('kemia.controller.Plugin');
goog.require('goog.functions');
goog.require('goog.debug.Logger');
goog.require('kemia.model.Arrow');
goog.require('kemia.model.Plus');

/**
 * simple Plugin for highlighting bonds and atoms
 * 
 * @constructor
 * @extends {kemia.controller.Plugin}
 */
kemia.controller.plugins.Highlight = function() {
	kemia.controller.Plugin.call(this);
};
goog.inherits(kemia.controller.plugins.Highlight, kemia.controller.Plugin);
goog.exportSymbol('kemia.controller.plugins.Highlight',
		kemia.controller.plugins.Highlight);

/** @inheritDoc */
kemia.controller.plugins.Highlight.prototype.getTrogClassId = goog.functions
		.constant('kemia.controller.plugins.Highlight');

/**
 * Logging object.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
kemia.controller.plugins.Highlight.prototype.logger = goog.debug.Logger
		.getLogger('kemia.controller.plugins.Highlight');

kemia.controller.plugins.Highlight.prototype.handleMouseMove = function(e) {

	var target = this.editorObject.findTarget(e);
	if (e.currentTarget.highlightGroup) {
		e.currentTarget.highlightGroup.clear();
	}

	if (target instanceof kemia.model.Atom) {

		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightAtom(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightAtom(target,
					e.currentTarget.highlightGroup);
		}
	} else if (target instanceof kemia.model.Bond) {
		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightBond(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightBond(target,
					e.currentTarget.highlightGroup);
		}

		// } else if (target instanceof kemia.model.Molecule) {
		// if (!e.currentTarget.highlightGroup) {
		// e.currentTarget.highlightGroup = this.highlightMolecule(target);
		// } else {
		// e.currentTarget.highlightGroup = this.highlightMolecule(target,
		// e.currentTarget.highlightGroup);
		// }

	} else if (target instanceof kemia.model.Arrow) {
		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightArrow(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightArrow(target,
					e.currentTarget.highlightGroup);
		}
	} else if (target instanceof kemia.model.Plus) {
		if (!e.currentTarget.highlightGroup) {
			e.currentTarget.highlightGroup = this.highlightPlus(target);
		} else {
			e.currentTarget.highlightGroup = this.highlightPlus(target,
					e.currentTarget.highlightGroup);
		}
	} else {
		e.currentTarget.highlightGroup = undefined;
	}
}

kemia.controller.plugins.Highlight.prototype.highlightBond = function(bond,
		opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.bondRendererFactory
			.get(bond).highlightOn(bond, opt_group);
};

kemia.controller.plugins.Highlight.prototype.highlightAtom = function(atom,
		opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.atomRenderer
			.highlightOn(atom, opt_group);
};

kemia.controller.plugins.Highlight.prototype.highlightMolecule = function(
		molecule, opt_group) {
	return this.editorObject.reactionRenderer.moleculeRenderer.highlightOn(
			molecule, opt_group);
};

kemia.controller.plugins.Highlight.prototype.highlightArrow = function(arrow,
		opt_group) {
	return this.editorObject.reactionRenderer.arrowRenderer.highlightOn(arrow,
			opt_group);
};

kemia.controller.plugins.Highlight.prototype.highlightPlus = function(plus,
		opt_group) {
	return this.editorObject.reactionRenderer.plusRenderer.highlightOn(plus,
			opt_group);
}
