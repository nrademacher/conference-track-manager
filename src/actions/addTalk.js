const { prompt } = require('inquirer');
const {
  MIN_TRACK_DURATION,
  MAX_TRACK_DURATION,
  BASE_TALK_START_TIME,
} = require('../constants');
const { stateMap } = require('../state');
const { validateTalkInput, parseMins, incrementTime } = require('../utils');

async function addTalk(state) {
  const input = {
    type: 'input',
    name: 'talk',
    message: 'Enter a talk:',
    validate: (value) => validateTalkInput(state.talks, value),
  };

  const talks = await prompt(input);
  const talkTokens = talks.talk.split(' ');
  const talkName = talkTokens.slice(0, -1).join(' ');
  const talkDuration = parseMins(talkTokens[talkTokens.length - 1]);

  // If added duration would exceed maximum track duration,
  // add another track and reset all relevant variables
  if (state.currentTrackDuration + talkDuration >= MAX_TRACK_DURATION) {
    state.currentTrackNum += 1;
    state.currentTrackDuration = 0;
    state.currentTrackComplete = false;
    state.maxMorningTalkRemaining = 180;
    state.maxEveningTalkRemaining = 240;
    state.nextTalkStartTime = BASE_TALK_START_TIME;
    state.morningFull = false;
    state.lunchEaten = false;
  } else if (
    state.currentTrackDuration + talkDuration >= MIN_TRACK_DURATION &&
    !state.currentTrackComplete
  ) {
    state.completedTrackNum += 1;
    state.currentTrackComplete = true;
  }
  state.currentTrackDuration += talkDuration;

  let session;
  let fillMorningStartTime;

  // Determine morning/evening session based on available time
  if (state.maxMorningTalkRemaining - talkDuration >= 0) {
    session = 'morning';
    state.maxMorningTalkRemaining -= talkDuration;

    if (state.morningComplete) {
      const [prevMorningTalk] = state.talks
        .filter((talk) => talk.session === 'morning')
        .slice(-1);
      fillMorningStartTime = incrementTime(
        fillMorningStartTime,
        prevMorningTalk.duration,
      );
    }
  } else if (state.maxEveningTalkRemaining - talkDuration >= 0) {
    state.morningComplete = true;

    if (!state.lunchEaten) {
      state.nextTalkStartTime = '01:00PM';
      state.lunchEaten = true;
    }

    session = 'evening';
    state.maxEveningTalkRemaining -= talkDuration;
  }

  const talkData = {
    startTime: fillMorningStartTime
      ? fillMorningStartTime
      : state.nextTalkStartTime,
    name: talkName,
    duration: talkDuration,
    track: state.currentTrackNum,
    session,
    rawName: talks.talk,
  };

  state.talks = [...state.talks, talkData];

  // Do not increment next start time if talk fills remaining morning session time
  if (!fillMorningStartTime) {
    state.nextTalkStartTime = incrementTime(
      state.nextTalkStartTime,
      talkDuration,
    );
  }

  // Use talk name as key for previous state for redo/undo actions
  return stateMap.chain(state, talks.talk);
}

module.exports = { addTalk };