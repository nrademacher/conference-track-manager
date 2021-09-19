const { addTalk } = require('./addTalk');
const { removeLastTalk } = require('./removeLastTalk');
const { undoAction } = require('./undoAction');
const { listTalks } = require('./listTalks');
const { printTrackTables } = require('./printTrackTables');
const { saveToFile } = require('./saveToFile');
const { loadFromFile } = require('./loadFromFile');
const { writeToCSV } = require('./writeToCSV');

module.exports = {
  addTalk,
  removeLastTalk,
  undoAction,
  listTalks,
  printTrackTables,
  saveToFile,
  loadFromFile,
  writeToCSV,
};
