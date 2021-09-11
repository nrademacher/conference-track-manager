const { validateTalkInput } = require('../src/utils');
const { MIN_TALK_DURATION, MAX_TALK_DURATION } = require('../src/constants');

const badInputFormatRes =
  'Talk names must be at least one word long and be followed by a duration in minutes.\nExample: "Revolutionary Conference Talk 30min"';
const disallowedDurationRes = `Talk duration must be in the format "[number]min" and between ${MIN_TALK_DURATION} and ${MAX_TALK_DURATION} minutes long.`;
const duplicateRes = 'A talk with the same name has already been submitted.';

describe('validateTalkInput rejecting bad input', () => {
  it('rejects empty input', () => {
    const input = '';

    const result = validateTalkInput([], input);

    expect(result).toEqual(badInputFormatRes);
  });

  it('rejects input missing a duration token', () => {
    const input = 'testtesttest';

    const result = validateTalkInput([], input);

    expect(result).toEqual(badInputFormatRes);
  });

  it('rejects bad duration tokens', () => {
    const inputOne = 'testtesttest dhu32d27d8d';
    const inputTwo = 'testtesttest 42';
    const inputThree = 'testtesttest min';
    const inputFour = 'testtesttest 42mi';

    const resultOne = validateTalkInput([], inputOne);
    const resultTwo = validateTalkInput([], inputTwo);
    const resultThree = validateTalkInput([], inputThree);
    const resultFour = validateTalkInput([], inputFour);

    expect(resultOne).toEqual(badInputFormatRes);
    expect(resultTwo).toEqual(badInputFormatRes);
    expect(resultThree).toEqual(badInputFormatRes);
    expect(resultFour).toEqual(badInputFormatRes);
  });

  it('does not reject valid input', () => {
    const inputOne = 'helloworld 42min';
    const inputTwo = 'hello world lightning';

    const resultOne = validateTalkInput([], inputOne);
    const resultTwo = validateTalkInput([], inputTwo);

    expect(resultOne).toStrictEqual(true);
    expect(resultTwo).toStrictEqual(true);
  });
});

describe('validateTalkInput rejecting inadmissible talk durations', () => {
  it('rejects durations shorter than the specified minimum', () => {
    const input = `Foo Bar Baz ${MIN_TALK_DURATION - 1}min`;

    const result = validateTalkInput([], input);

    expect(result).toEqual(disallowedDurationRes);
  });

  it('rejects durations longer than the specified maximum', () => {
    const input = `Foo Bar Baz ${MAX_TALK_DURATION + 1}min`;

    const result = validateTalkInput([], input);

    expect(result).toEqual(disallowedDurationRes);
  });

  it('does not reject durations longer than the specified minimum', () => {
    const input = `Foo Bar Baz ${MIN_TALK_DURATION + 1}min`;

    const result = validateTalkInput([], input);

    expect(result).toStrictEqual(true);
  });

  it('does not reject durations shoter than the specified maximum', () => {
    const input = `Foo Bar Baz ${MAX_TALK_DURATION - 1}min`;

    const result = validateTalkInput([], input);

    expect(result).toStrictEqual(true);
  });
});

describe('validateTalkInput rejecting duplicates', () => {
  let talkArr = [];

  beforeEach(() => (talkArr = []));

  it('rejects names of talks that are already in the talk array', () => {
    talkArr = [{ name: 'Foo' }, { name: 'Bar' }];
    const inputOne = 'Foo 42min';
    const inputTwo = 'Bar lightning';

    const resultOne = validateTalkInput(talkArr, inputOne);
    const resultTwo = validateTalkInput(talkArr, inputTwo);

    expect(resultOne).toEqual(duplicateRes);
    expect(resultTwo).toEqual(duplicateRes);
  });

  it('does not reject partial matches', () => {
    talkArr = [{ name: 'Foo Bar Baz' }];
    const input = 'Foo 42min';

    const result = validateTalkInput(talkArr, input);

    expect(result).toStrictEqual(true);
  });
});
