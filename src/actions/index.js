const { addTalk } = require('./addTalk');
const { removeLastTalk } = require('./removeLastTalk');
const { undoRemoveTalk } = require('./undoRemoveTalk');
const { listTalks } = require('./listTalks');
const { printTrackTables } = require('./printTrackTables');
const { saveToFile } = require('./saveToFile');
const { loadFromFile } = require('./loadFromFile');
const { writeToCSV } = require('./writeToCSV');

module.exports = {
  addTalk,
  removeLastTalk,
  undoRemoveTalk,
  listTalks,
  printTrackTables,
  saveToFile,
  loadFromFile,
  writeToCSV,
};
