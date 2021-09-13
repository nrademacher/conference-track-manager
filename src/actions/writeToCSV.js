const { parse } = require('json2csv');
const { writeFileSync } = require('fs');
const { red, green } = require('chalk');
const { generateTrack } = require('../helpers');

function writeToCSV(talksArr) {
  const { trackNum } = talksArr[talksArr.length - 1];

  let trackArr = [];
  for (let i = 0; i <= trackNum - 1; i++) {
    const track = generateTrack(talksArr, i + 1);
    trackArr = [...trackArr, ...track];
  }

  const fields = [
    { label: 'Track', value: 'track' },
    { label: 'Start time', value: 'startTime' },
    { label: 'Talk name', value: 'name' },
    { label: 'Duration in minutes', value: 'duration' },
  ];

  const opts = { fields };
  const fileName = `conference-${Date.now()}.csv`;

  try {
    const csv = parse(trackArr, opts);
    writeFileSync(fileName, csv);
  } catch (error) {
    console.error(red('Error writing to file: '), error);

    return 1;
  }

  console.log(green(`\nSuccessfully written to ${fileName}!`));

  return 0;
}

module.exports = { writeToCSV };
