const { writeFileSync } = require('fs');
const { green, red } = require('chalk');

function saveToFile(state) {
  const saveState = JSON.stringify(state);

  try {
    writeFileSync('.save_states/.save-state.json', saveState);
  } catch (error) {
    console.error(red('Error saving file: '), error);

    return 1;
  }

  console.log(green('\nSave successful!'));

  return 0;
}

module.exports = { saveToFile };
