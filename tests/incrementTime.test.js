const { incrementTime } = require('../src/utils');

describe('incrementTime', () => {
  it('increments hours when passed sufficient minutes', () => {
    const startTime = '09:45AM';
    const incrementInMins = 16;

    const result = incrementTime(startTime, incrementInMins);

    expect(result).toStrictEqual('10:01AM');
  });

  it('switches to PM when time is incremented to noon', () => {
    const startTime = '10:57AM';
    const incrementInMins = 63;

    const result = incrementTime(startTime, incrementInMins);

    expect(result).toStrictEqual('12:00PM');
  });

  it('switches to PM when time is incremented past noon', () => {
    const startTime = '08:36AM';
    const incrementInMins = 243;

    const result = incrementTime(startTime, incrementInMins);

    expect(result).toStrictEqual('12:39PM');
  });

  it('switches to AM when time is incremented to midnight', () => {
    const startTime = '10:17PM';
    const incrementInMins = 103;

    const result = incrementTime(startTime, incrementInMins);

    expect(result).toStrictEqual('12:00AM');
  });

  it('switches to AM when time is incremented past midnight', () => {
    const startTime = '11:13PM';
    const incrementInMins = 317;

    const result = incrementTime(startTime, incrementInMins);

    expect(result).toStrictEqual('04:30AM');
  });

  it('increments correctly for a large amount of minutes', () => {
    const startTime = '05:16AM';
    const incrementInMins = 2887;

    const result = incrementTime(startTime, incrementInMins);

    expect(result).toStrictEqual('05:23AM');
  });
});
