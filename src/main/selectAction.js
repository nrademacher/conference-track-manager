const {
  ADD_TALK,
  REMOVE_TALK,
  UNDO_ACTION,
  LIST_TALKS,
  PRINT_TRACK_TABLES,
  WRITE_TO_CSV,
  SAVE_TO_FILE,
  LOAD_FROM_FILE,
  EXIT,
} = require('../constants');
const {
  addTalk,
  loadFromFile,
  printTrackTables,
  removeLastTalk,
  saveToFile,
  writeToCSV,
  listTalks,
  undoAction,
} = require('../actions');

async function selectAction(choice, state, callback) {
  switch (choice) {
    case ADD_TALK:
      await addTalk({ ...state });
      return callback();
    case REMOVE_TALK:
      removeLastTalk(state.talks);
      return callback();
    case UNDO_ACTION:
      undoAction();
      return callback();
    case LIST_TALKS:
      listTalks(state.talks);
      return callback();
    case PRINT_TRACK_TABLES:
      printTrackTables(state.talks, state.completedTrackNum);
      return callback();
    case WRITE_TO_CSV:
      writeToCSV(state.talks);
      return callback();
    case SAVE_TO_FILE:
      saveToFile(state);
      return callback();
    case LOAD_FROM_FILE:
      await loadFromFile();
      return callback();
    case EXIT:
      return 0;
    default:
      return 1;
  }
}

module.exports = { selectAction };
