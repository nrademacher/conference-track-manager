const { useStateKey } = require('../state');

function removeLastTalk(talks) {
  const { rawName: key } = talks[talks.length - 1];

  const { state, setProxyKey, chainState } = useStateKey(key);

  // Points to key until undo action or next undoable action is executed
  setProxyKey('undo');

  return chainState(state);
}

module.exports = { removeLastTalk };
