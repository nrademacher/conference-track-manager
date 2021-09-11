const Table = require('cli-table3');
const { bold, whiteBright } = require('chalk');

function buildTable(talks) {
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

  talks.forEach((talk) => {
    table.push([
      talk.startTime,
      talk.name,
      typeof talk.duration === 'number'
        ? talk.duration + ' minutes'
        : talk.duration,
    ]);
  });

  return table;
}

module.exports = { buildTable };
