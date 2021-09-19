const { green, gray, blue, bold } = require('chalk');
const { MIN_TRACK_DURATION, MAX_TRACK_DURATION } = require('../constants');

function displayTrackStatsMsg(completedTracks, trackDuration, trackNum) {
  const trackIndicatorCol = completedTracks ? green : gray;

  const fillTrackMsg = `fill another ${blue(
    MIN_TRACK_DURATION - trackDuration,
  )} minutes to complete current track`;

  const leftInTrackMsg = `${blue(
    MAX_TRACK_DURATION - trackDuration,
  )} minutes remaining in this track`;

  const message = `\n\tCompleted tracks: ${trackIndicatorCol(
    completedTracks,
  )} / ${bold(trackNum)} - ${
    MIN_TRACK_DURATION - trackDuration > 0 ? fillTrackMsg : leftInTrackMsg
  }\n`;

  console.log(message);

  return 0;
}

module.exports = { displayTrackStatsMsg };
