const { BASE_TALK_START_TIME } = require('../constants');

const initState = Object.freeze({
  completedTrackNum: 0,
  currentTrackComplete: false,
  currentTrackDuration: 0,
  currentTrackNum: 1,
  lunchEaten: false,
  maxAfternoonTalkRemaining: 240,
  maxMorningTalkRemaining: 180,
  morningComplete: false,
  nextTalkStartTime: BASE_TALK_START_TIME,
  talks: [],
});

module.exports = { initState };
