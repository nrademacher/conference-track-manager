const { stateMap } = require('../state');

function removeLastTalk(state) {
  const key = talks.slice(-1)[0].rawName;

  const prevState = stateMap.resolve(key);

  stateMap.set('undo', key);

  return stateMap.chain({ ...prevState }, key);
}

module.exports = { removeLastTalk };
