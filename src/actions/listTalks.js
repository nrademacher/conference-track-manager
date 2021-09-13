const { bold, blueBright } = require('chalk');

function listTalks(talks) {
  console.log('\n');
  talks.forEach((talk, i) => console.log(
      `${bold(i + 1 + '.')} ${talk.name}, ${blueBright(talk.duration)} minutes`,
    ),
  );
  console.log('\n');

  return 0;
}

module.exports = { listTalks };
