const { buildTable } = require('../helpers');

function previewSchedule(talks) {
  const table = buildTable(talks);

  console.log('\n');
  console.log(table.toString());
  console.log('\n');

  return 0;
}

module.exports = { previewSchedule };
