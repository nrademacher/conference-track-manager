const { bold } = require('chalk');

function listTalks(talks) {
  console.log('\n');
  talks.forEach((talk, i) =>
    console.log(`${i + 1}. ${bold(talk.name)} - ${talk.duration} minutes`),
  );
  console.log('\n');

  return 0;
}

module.exports = { listTalks };
