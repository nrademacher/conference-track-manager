const { APP_VERSION } = require('./version');
const {
  MIN_TALK_DURATION,
  MAX_TALK_DURATION,
  MIN_TRACK_DURATION,
  MAX_TRACK_DURATION,
  BASE_TALK_START_TIME,
} = require('./parameters');
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
} = require('./actions');

module.exports = {
  APP_VERSION,
  MIN_TRACK_DURATION,
  MAX_TRACK_DURATION,
  MIN_TALK_DURATION,
  MAX_TALK_DURATION,
  BASE_TALK_START_TIME,
  ADD_TALK,
  REMOVE_TALK,
  UNDO_ACTION,
  LIST_TALKS,
  PRINT_TRACK_TABLES,
  WRITE_TO_CSV,
  SAVE_TO_FILE,
  LOAD_FROM_FILE,
  EXIT,
};
