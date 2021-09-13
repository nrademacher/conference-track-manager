const { stateMap } = require('../state');

function removeLastTalk(talks) {
  const { rawName: key } = talks[talks.length - 1];

  const prevState = stateMap.resolve(key);

  stateMap.set('undo', key);

  return stateMap.chain({ ...prevState }, key);
}

module.exports = { removeLastTalk };
