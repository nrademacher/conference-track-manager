const { generateTrack } = require('../src/helpers');
const { testTalkArr } = require('./testData');

describe('generateTrack', () => {
  it('builds a conference track for the specified track number', () => {
    const trackNum = 1;

    const result = generateTrack(testTalkArr, trackNum);
    const filteredInputArr = testTalkArr.filter(
      (item) => item.track === trackNum,
    );

    expect(result).toHaveLength(filteredInputArr.length + 2);
  });

  it('includes exactly one "Lunch" and one "Networking Event" item per track', () => {
    const trackNum = 1;

    const result = generateTrack(testTalkArr, trackNum);
    const lunchArr = result.filter((item) => item.name === 'Lunch');
    const networkingEventArr = result.filter(
      (item) => item.name === 'Networking Event',
    );

    expect(lunchArr).toHaveLength(1);
    expect(networkingEventArr).toHaveLength(1);
  });

  it('inserts "Lunch" and "Networking Event" correctly', () => {
    const trackNum = 1;

    const result = generateTrack(testTalkArr, trackNum);
    const lunch = result.find((item) => item.name === 'Lunch');
    const networkingEvent = result.find(
      (item) => item.name === 'Networking Event',
    );
    const lunchIdx = result.indexOf(lunch);
    const networkingEventIdx = result.indexOf(networkingEvent);
    const talkbeforeLunch = result[lunchIdx - 1];
    const talkAfterLunch = result[lunchIdx + 1];
    const talkbeforeLunchStartTime = talkbeforeLunch.startTime;

    expect(networkingEventIdx).toEqual(result.length - 1);
    expect(talkbeforeLunchStartTime).toContain('AM');
    expect(talkbeforeLunch).toHaveProperty('session', 'morning');
    expect(talkAfterLunch).toHaveProperty('startTime', '01:00PM');
    expect(talkAfterLunch).toHaveProperty('session', 'afternoon');
  });
});
