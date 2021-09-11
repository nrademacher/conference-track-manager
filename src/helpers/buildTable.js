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

