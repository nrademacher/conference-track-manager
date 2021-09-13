const { parseMins } = require('./parseMins');
const { MIN_TALK_DURATION, MAX_TALK_DURATION } = require('../constants');

function validateTalkInput(talkArr, input) {
  const inputTokens = input.split(' ');
  const titleToken = inputTokens.slice(0, -1).join(' ');
  const durationToken = inputTokens[inputTokens.length - 1];

  if (
    inputTokens.length < 2 ||
    (!durationToken.match(/[0-9]+min/) && durationToken !== 'lightning')
  ) {
    return 'Talk names must be at least one word long and be followed by a duration in minutes.\nExample: "Revolutionary Conference Talk 30min"';
  }

  if (titleToken.match(/[0-9]+/)) {
    return 'Talk titles must not include numbers';
  }

  const duration = parseMins(durationToken);
  if (duration < MIN_TALK_DURATION || duration > MAX_TALK_DURATION) {
    return `Talk duration must be in the format "[number]min" and between ${MIN_TALK_DURATION} and ${MAX_TALK_DURATION} minutes long.`;
  }

  const findDuplicate = talkArr.find(
    (talk) => inputTokens.slice(0, -1).join(' ') === talk.name,
  );
  if (findDuplicate) {
    return 'A talk with the same name has already been submitted.';
  }

  return true;
}

module.exports = { validateTalkInput };
