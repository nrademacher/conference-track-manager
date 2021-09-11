const { addTalk } = require('./addTalk');
const { removeLastTalk } = require('./removeLastTalk');
const { undoRemoveTalk } = require('./undoRemoveTalk');
const { previewSchedule } = require('./previewSchedule');
const { printTrackTables } = require('./printTrackTables');

module.exports = {
  addTalk,
  removeLastTalk,
  undoRemoveTalk,
  previewSchedule,
  printTrackTables,
};
