const { stateMap } = require('../state');

function undoRemove() {
  const state = stateMap.resolve('_undo');

  stateMap.delete('_undo');

  return stateMap.chain({ ...state });
}

module.exports = { undoRemove };
