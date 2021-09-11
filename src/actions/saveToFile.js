const { writeFileSync } = require('fs');
const { green, red } = require('chalk');
const { appState } = require('../state');

function saveToFile() {
  const saveState = JSON.stringify(appState);

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
