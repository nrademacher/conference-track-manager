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
        top: '═',
        'top-mid': '╤',
        'top-left': '╔',
        'top-right': '╗',
        bottom: '═',
        'bottom-mid': '╧',
        'bottom-left': '╚',
        'bottom-right': '╝',
        left: '║',
        'left-mid': '╟',
        mid: '─',
        'mid-mid': '┼',
        right: '║',
        'right-mid': '╢',
        middle: '│',
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
