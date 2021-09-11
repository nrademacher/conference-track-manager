const { bold, blueBright } = require('chalk');
const { APP_VERSION } = require('./constants');
const { stateMap } = require('./state');
const { displayTrackStatsMsg, getActionChoice } = require('./helpers');
const {
  addTalk,
  loadFromFile,
  printTrackTables,
  removeLastTalk,
  saveToFile,
  writeToCSV,
  undoRemove,
  previewSchedule,
} = require('./actions');

async function selectAction() {
  const state = stateMap.resolve('current');

  displayTrackStatsMsg(
    state.completedTrackNum,
    state.currentTrackDuration,
    state.currentTrackNum,
  );

  const choice = await getActionChoice(state.completedTrackNum, state.talks);

  switch (choice) {
    case 'Add':
      await addTalk({ ...state });
      return selectAction();
    case 'Undo':
      removeLastTalk({ ...state });
      return selectAction();
    case 'Redo':
      undoRemove({ ...state });
      return selectAction();
    case 'View':
      previewSchedule(state.talks);
      return selectAction();
    case 'Print':
      printTrackTables(state.talks, state.completedTrackNum);
      return selectAction();
    case 'Write':
      writeToCSV(state.talks);
      return selectAction();
    case 'Save':
      saveToFile();
      return selectAction();
    case 'Load':
      await loadFromFile();
      return selectAction();
    case 'Exit':
      return 0;
    default:
      return 1;
  }
}

function init() {
  console.log(
    bold(
      blueBright(
        `\nWelcome to Conference Track Manager${
          APP_VERSION ? ` v${APP_VERSION}` : ''
        }!`,
      ),
    ),
  );

  return selectAction();
}

init();

