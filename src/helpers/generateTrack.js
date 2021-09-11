const { incrementTime } = require('../utils');

function generateTrack(talksArr, trackNum) {
  const morningTalks = talksArr.filter(
    (talk) => talk.session === 'morning' && talk.track === trackNum,
  );
  const eveningTalks = talksArr.filter(
    (talk) => talk.session === 'evening' && talk.track === trackNum,
  );

  const lunch = {
    track: trackNum,
    startTime: '12:00PM',
    name: 'Lunch',
    duration: 60,
  };

  const networkingStartTime = incrementTime(
    eveningTalks.slice(-1)[0].startTime,
    eveningTalks.slice(-1)[0].duration,
  );

  const networkingEvent = {
    track: trackNum,
    startTime: networkingStartTime,
    name: 'Networking Event',
    duration: 'Open-ended',
  };

  const track = [...morningTalks, lunch, ...eveningTalks, networkingEvent];

  return track;
}

module.exports = { generateTrack };
