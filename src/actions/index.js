const { addTalk } = require('./addTalk');
const { removeLastTalk } = require('./removeLastTalk');
const { undoRemoveTalk } = require('./undoRemoveTalk');
const { previewSchedule } = require('./previewSchedule');
const { printTrackTables } = require('./printTrackTables');
const { saveToFile } = require('./saveToFile');
const { loadFromFile } = require('./loadFromFile');

module.exports = {
  addTalk,
  removeLastTalk,
  undoRemoveTalk,
  previewSchedule,
  printTrackTables,
  saveToFile,
  loadFromFile,
};
