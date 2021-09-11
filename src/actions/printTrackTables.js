const Table = require('cli-table3');
const { bold, whiteBright } = require('chalk');
const { generateTrack } = require('../helpers');

function printTrackTables(talksArr, trackNum) {
  const tables = [];

  for (let i = 0; i <= trackNum - 1; i++) {
    const track = generateTrack(talksArr, i + 1);

    const table = new Table({
      head: [
        bold(whiteBright('START TIME')),
        bold(whiteBright('TALK NAME')),
        bold(whiteBright('DURATION')),
      ],
      chars: {
        top: '‚ïê',
        'top-mid': '‚ï§',
        'top-left': '‚ïî',
        'top-right': '‚ïó',
        bottom: '‚ïê',
        'bottom-mid': '‚ïß',
        'bottom-left': '‚ïö',
        'bottom-right': '‚ïù',
        left: '‚ïë',
        'left-mid': '‚ïü',
        mid: '‚îÄ',
        'mid-mid': '‚îº',
        right: '‚ïë',
        'right-mid': '‚ï¢',
        middle: '‚îÇ',
      },
    });

    track.forEach((talk) => {
      table.push([
        talk.startTime,
        talk.name,
        typeof talk.duration === 'number'
          ? talk.duration + ' minutes'
          : talk.duration,
      ]);
    });

    tables.push(table);
  }

  let output = '';
  tables.forEach((table, i) => {
    output += bold(`\nTrack ${i + 1}:\n`);
    output += table.toString() + '\n';
  });

  console.log(output);

  return output;
}

module.exports = { printTrackTables };
