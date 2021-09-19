const { useStateKey } = require('../state');

function undoAction() {
  const { getValue, discardKey } = useStateKey('undo');

  // Get the state key that 'undo' was mapped to
  const key = getValue();

  // Free up 'undo' key
  discardKey();

  const { state, chainState } = useStateKey(key);

  return chainState({ ...state });
}

module.exports = { undoAction };
