const { stateMap } = require('../state');
const { selectAction } = require('./selectAction');
const { displayTrackStatsMsg } = require('./displayTrackStatsMsg');
const { getActionChoice } = require('./getActionChoice');

async function main() {
  const state = stateMap.resolve('current');

  displayTrackStatsMsg(
    state.completedTrackNum,
    state.currentTrackDuration,
    state.currentTrackNum,
  );

  const choice = await getActionChoice(state.completedTrackNum, state.talks);

  return selectAction(choice, state, main);
}

module.exports = { main };
