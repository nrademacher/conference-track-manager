const { stateMap } = require('../state');

function undoRemoveTalk() {
  const state = stateMap.resolve('undo');

  const key = stateMap.get('undo');

  stateMap.delete('undo');

  return stateMap.chain({ ...state }, key);
}

module.exports = { undoRemoveTalk };
