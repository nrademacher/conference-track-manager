const { prompt } = require('inquirer');
const {
  MIN_TRACK_DURATION,
  MAX_TRACK_DURATION,
  BASE_TALK_START_TIME,
} = require('../constants');
const { validateTalkInput, parseMins, incrementTime } = require('../utils');
const { useStateKey } = require('../state');

async function addTalk(state) {
  const { discardKey, setProxyKey, chainState } = useStateKey();

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

  // If added duration would exceed maximum track duration, start new track
  if (state.currentTrackDuration + talkDuration >= MAX_TRACK_DURATION) {
    state.currentTrackNum += 1;
    state.currentTrackDuration = 0;
    state.currentTrackComplete = false;
    state.maxMorningTalkRemaining = 180;
    state.maxAfternoonTalkRemaining = 240;
    state.nextTalkStartTime = BASE_TALK_START_TIME;
    state.morningComplete = false;
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

  // Determine morning/afternoon session based on available time
  if (state.maxMorningTalkRemaining - talkDuration >= 0) {
    session = 'morning';
    state.maxMorningTalkRemaining -= talkDuration;

    // Try to fill gap before lunch, else move to afternoon
    if (state.morningComplete) {
      const [prevMorningTalk] = state.talks.
        filter((talk) => talk.session === 'morning').
        slice(-1);
      fillMorningStartTime = incrementTime(
        prevMorningTalk.startTime,
        prevMorningTalk.duration,
      );
    }
  } else if (state.maxAfternoonTalkRemaining - talkDuration >= 0) {
    state.morningComplete = true;
    session = 'afternoon';
    state.maxAfternoonTalkRemaining -= talkDuration;

    if (!state.lunchEaten) {
      state.nextTalkStartTime = '01:00PM';
      state.lunchEaten = true;
    }
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

  // Don't increment next start time if talk fills remaining morning session time
  if (!fillMorningStartTime) {
    state.nextTalkStartTime = incrementTime(
      state.nextTalkStartTime,
      talkDuration,
    );
  }

  // Make sure undo key is unset, otherwise would skip back to state mapped to it
  discardKey('undo');

  // Use talk name as key for current state for redo/undo actions
  setProxyKey(talks.talk);

  return chainState(state);
}

module.exports = { addTalk };
