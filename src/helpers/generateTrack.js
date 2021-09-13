const { incrementTime } = require('../utils');

function generateTrack(talksArr, trackNum) {
  const morningTalks = talksArr.filter(
    (talk) => talk.session === 'morning' && talk.track === trackNum,
  );
  const afternoonTalks = talksArr.filter(
    (talk) => talk.session === 'afternoon' && talk.track === trackNum,
  );

  const lunch = {
    track: trackNum,
    startTime: '12:00PM',
    name: 'Lunch',
    duration: 60,
  };

  const { startTime, duration } = afternoonTalks[afternoonTalks.length - 1];
  const networkingStartTime = incrementTime(startTime, duration);

  const networkingEvent = {
    track: trackNum,
    startTime: networkingStartTime,
    name: 'Networking Event',
    duration: 'Open-ended',
  };

  const track = [...morningTalks, lunch, ...afternoonTalks, networkingEvent];

  return track;
}

module.exports = { generateTrack };
