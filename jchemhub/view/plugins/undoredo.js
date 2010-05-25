goog.provide('jchemhub.view.plugins.UndoRedo');
goog.require('goog.debug.Logger');

/**
 * @constructor
 * @extends{jchemhubn.view.Plugin}s
 */
jchemhub.view.plugins.UndoRedo = function() {
	jchemhub.view.Plugin.call(this);

	/**
	 * The maximum number of states on the undo stack at any time. Used to limit
	 * the memory footprint of the undo-redo stack.
	 * 
	 * @type {number}
	 * @private
	 */
	this.maxUndoDepth_ = 100;

	/**
	 * The undo stack.
	 * 
	 * @type {Array}
	 * @private
	 */
	this.undoStack_ = [];

	/**
	 * The redo stack.
	 * 
	 * @type {Array}
	 * @private
	 */
	this.redoStack_ = [];

	this.currentState_ = null;
}
goog.inherits(jchemhub.view.plugins.UndoRedo, jchemhub.view.Plugin);

/**
 * Commands implemented by this plugin.
 * 
 * @enum {string}
 */
jchemhub.view.plugins.UndoRedo.COMMAND = {
	UNDO : 'undo',
	REDO : 'redo'
};

/**
 * Inverse map of execCommand strings to
 * {@link jchemhub.view.plugins.UndoRedo.COMMAND} constants. Used to determine
 * whether a string corresponds to a command this plugin handles
 * 
 * @type {Object}
 * @private
 */
jchemhub.view.plugins.UndoRedo.SUPPORTED_COMMANDS_ = goog.object
		.transpose(jchemhub.view.plugins.UndoRedo.COMMAND);

/** @inheritDoc */
jchemhub.view.plugins.UndoRedo.prototype.getTrogClassId = function() {
	return 'UndoRedo';
};

/** @inheritDoc */
jchemhub.view.plugins.UndoRedo.prototype.isSupportedCommand = function(command) {
	return command in jchemhub.view.plugins.UndoRedo.SUPPORTED_COMMANDS_;
};

/** @inheritDoc */
jchemhub.view.plugins.UndoRedo.prototype.execCommandInternal = function(command) {
	if (command == jchemhub.view.plugins.UndoRedo.COMMAND.UNDO) {
		this.undo();
	} else if (command == jchemhub.view.plugins.UndoRedo.COMMAND.REDO) {
		this.redo();
	}

	this.editorObject.layoutAndRender();

};

/**
 * Clear the undo/redo stack.
 */
jchemhub.view.plugins.UndoRedo.prototype.clearHistory = function() {
	if (this.undoStack_.length > 0 || this.redoStack_.length > 0) {
		this.undoStack_.length = 0;
		this.redoStack_.length = 0;
		this.dispatchStateChange_();
	}
};

/**
 * Before the editor changes, we want to save the state.
 * 
 * @param {goog.events.Event}
 *            e The event.
 * @private
 */
jchemhub.view.plugins.UndoRedo.prototype.handleBeforeChange_ = function(e) {
	this.logger.info('handleBeforeChange');

	var editorObj = /** @type {jchemhub.view.ReactionEditor} */
	(e.target);

	this.updateCurrentState_(editorObj);

};

/**
 * Helper method for saving state.
 * 
 * @param {jchemhub.view.ReactionEditor}
 *            edtiorObj The field object.
 * @private
 */
jchemhub.view.plugins.UndoRedo.prototype.updateCurrentState_ = function(
		editorObj) {
	var content = editorObj.getModel();
	if (content) {
		//serialize to json object
		content = jchemhub.io.json.reactionToJson(editorObj.getModel());		
	}
	var currentState = this.currentState_;

	if (currentState) {

		this.addState(currentState);
	}

	this.currentState_ = content;
};

/**
 * Add state to the undo stack. This clears the redo stack.
 * 
 * @param {goog.editor.plugins.UndoRedoState}
 *            state The state to add to the undo stack.
 */
jchemhub.view.plugins.UndoRedo.prototype.addState = function(state) {

	this.undoStack_.push(state);
	if (this.undoStack_.length > this.maxUndoDepth_) {
		this.undoStack_.shift();

		// Clobber the redo stack.
		var redoLength = this.redoStack_.length;
		this.redoStack_.length = 0;

		this.dispatchEvent( {
			type : jchemhub.view.plugins.UndoRedo.EventType.STATE_ADDED,
			state : state
		});

		// If the redo state had states on it, then clobbering the redo stack
		// above
		// has caused a state change.
		if (this.undoStack_.length == 1 || redoLength) {
			this.dispatchStateChange_();
		}
	}
};

/**
 * Dispatches a STATE_CHANGE event with this as the target.
 * 
 * @private
 */
jchemhub.view.plugins.UndoRedo.prototype.dispatchStateChange_ = function() {
	this.dispatchEvent(jchemhub.view.plugins.UndoRedo.EventType.STATE_CHANGE);
};

/**
 * Performs the undo operation of the state at the top of the undo stack, moving
 * that state to the top of the redo stack. If the undo stack is empty, does
 * nothing.
 */
jchemhub.view.plugins.UndoRedo.prototype.undo = function() {
	this.logger.info('undo');
	this.shiftState_(this.undoStack_, this.redoStack_);
};

/**
 * Performs the redo operation of the state at the top of the redo stack, moving
 * that state to the top of the undo stack. If redo undo stack is empty, does
 * nothing.
 */
jchemhub.view.plugins.UndoRedo.prototype.redo = function() {
	this.shiftState_(this.redoStack_, this.undoStack_);
};

/**
 * @return {boolean} Whether the undo stack has items on it, i.e., if it is
 *         possible to perform an undo operation.
 */
jchemhub.view.plugins.UndoRedo.prototype.hasUndoState = function() {
	return this.undoStack_.length > 0;
};

/**
 * @return {boolean} Wether the redo stack has items on it, i.e., if it is
 *         possible to perform a redo operation.
 */
jchemhub.view.plugins.UndoRedo.prototype.hasRedoState = function() {
	return this.redoStack_.length > 0;
};

/**
 * Move a state from one stack to the other, performing the appropriate undo or
 * redo action.
 * 
 * @param {Array}
 *            fromStack Stack to move the state from.
 * @param {Array}
 *            toStack Stack to move the state to.
 * @private
 */
jchemhub.view.plugins.UndoRedo.prototype.shiftState_ = function(fromStack,
		toStack) {
	if (fromStack.length) {
		var state = fromStack.pop();

		// Push the current state into the redo stack.
		toStack.push(state);
		this.editorObject.setModel(jchemhub.io.json.readReaction(state));
		this.editorObject.layoutAndRender();

		// If either stack transitioned between 0 and 1 in size then the ability
		// to do an undo or redo has changed and we must dispatch a state
		// change.
		if (fromStack.length == 0 || toStack.length == 1) {
			this.dispatchStateChange_();
		}
	}
};

/** @inheritDoc */
jchemhub.view.plugins.UndoRedo.prototype.enable = function(editorObject) {
	jchemhub.view.plugins.UndoRedo.superClass_.enable.call(this, editorObject);

	// Don't want pending delayed changes from when undo-redo was disabled
	// firing after undo-redo is enabled since they might cause undo-redo stack
	// updates.
//	editorObject.clearDelayedChange();

	this.eventHandler = new goog.events.EventHandler(this);
	// It also seems like the if check below is just a bad one. We should do
	// this
	// for browsers that use mutation events as well even though the
	// beforechange
	// happens too late...maybe not. I don't know about this.
	if (!goog.editor.BrowserFeature.USE_MUTATION_EVENTS) {
		// We don't listen to beforechange in mutation-event browsers because
		// there we fire beforechange, then syncronously file change. The point
		// of before change is to capture before the user has changed anything.
		this.eventHandler.listen(editorObject,
				jchemhub.view.ReactionEditor.EventType.BEFORECHANGE,
				this.handleBeforeChange_);
	}
	this.eventHandler.listen(editorObject,
			jchemhub.view.ReactionEditor.EventType.DELAYEDCHANGE,
			this.handleDelayedChange_);
	this.eventHandler.listen(editorObject,
			jchemhub.view.ReactionEditor.EventType.BLUR, this.handleBlur_);

	// We want to capture the initial state of a Trogedit field before any
	// editing has happened. This is necessary so that we can undo the first
	// change to a field, even if we don't handle beforeChange.
	this.updateCurrentState_(editorObject);
};

/** @inheritDoc */
jchemhub.view.plugins.UndoRedo.prototype.disable = function(editorObject) {
	// Process any pending changes so we don't lose any undo-redo states that we
	// want prior to disabling undo-redo.
	editorObject.clearDelayedChange();

	this.eventHandler.dispose();
	this.eventHandler = null;
	this.currentState_ = null;

};

/** @inheritDoc */
jchemhub.view.plugins.UndoRedo.prototype.disposeInternal = function() {
	goog.editor.plugins.UndoRedo.superClass_.disposeInternal.call(this);
	this.eventHandler.dispose();
	this.editorObject = null;

};


/**
 * Event types for the events dispatched by undo-redo 
 * @enum {string}
 */
jchemhub.view.plugins.UndoRedo.EventType = {
  /**
   * Signifies that he undo or redo stack transitioned between 0 and 1 states,
   * meaning that the ability to perform undo or redo operations has changed.
   */
  STATE_CHANGE: 'state_change',

  /**
   * Signifies that a state was just added to the undo stack. Events of this
   * type will have a {@code state} property whose value is the state that
   * was just added.
   */
  STATE_ADDED: 'state_added',

  /**
   * Signifies that the undo method of a state is about to be called.
   * Events of this type will have a {@code state} property whose value is the
   * state whose undo action is about to be performed. If the event is cancelled
   * the action does not proceed, but the state will still transition between
   * stacks.
   */
  BEFORE_UNDO: 'before_undo',

  /**
   * Signifies that the redo method of a state is about to be called.
   * Events of this type will have a {@code state} property whose value is the
   * state whose redo action is about to be performed. If the event is cancelled
   * the action does not proceed, but the state will still transition between
   * stacks.
   */
  BEFORE_REDO: 'before_redo'
};


/**
 * The logger for this class.
 * 
 * @type {goog.debug.Logger}
 * @protected
 */
jchemhub.view.plugins.UndoRedo.prototype.logger = goog.debug.Logger
		.getLogger('jchemhub.view.plugins.UndoRedo');