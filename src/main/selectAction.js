const {
  addTalk,
  loadFromFile,
  printTrackTables,
  removeLastTalk,
  saveToFile,
  writeToCSV,
  listTalks,
  undoRemoveTalk,
} = require('../actions');

async function selectAction(choice, state, callback) {
  switch (choice) {
    case 'Add':
      await addTalk({ ...state });
      return callback();
    case 'Undo':
      removeLastTalk(state.talks);
      return callback();
    case 'Redo':
      undoRemoveTalk();
      return callback();
    case 'List':
      listTalks(state.talks);
      return callback();
    case 'Print':
      printTrackTables(state.talks, state.completedTrackNum);
      return callback();
    case 'Write':
      writeToCSV(state.talks);
      return callback();
    case 'Save':
      saveToFile();
      return callback();
    case 'Load':
      await loadFromFile();
      return callback();
    case 'Exit':
      return 0;
    default:
      return 1;
  }
}

module.exports = { selectAction };
