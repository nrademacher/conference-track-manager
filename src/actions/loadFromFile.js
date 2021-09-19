const { prompt, Separator } = require('inquirer');
const { existsSync, readFileSync } = require('fs');
const { green, red } = require('chalk');
const { stateMap } = require('../state');

async function loadFromFile() {
  const input = {
    type: 'list',
    message: 'Choose an option',
    name: 'selection',
    choices: [
      'Load a sample conference (2 tracks, 19 talks)',
      new Separator(),
      'Return',
    ],
  };

  let parsedState;

  if (existsSync('.save_states/.save-state.json')) {
    const savedState = readFileSync('.save_states/.save-state.json');

    parsedState = JSON.parse(savedState);

    input.choices.unshift(
      `Load saved conference (${parsedState.completedTrackNum} tracks, ${parsedState.talks.length} talks)`,
    );
  }

  const { selection } = await prompt(input);

  if (selection.includes('Load a sample conference')) {
    let sampleConference;

    try {
      sampleConference = readFileSync('.save_states/.sample-conference.json');
    } catch (error) {
      console.error(red('Error loading file: '), error);

      return 1;
    }

    parsedState = JSON.parse(sampleConference);

    console.log(green('\nLoad successful!'));

    // Set undo key for undoAction()
    stateMap.set('undo', 'Load sample conference');

    // Add new state and map previous state to key 'undo' points to
    return stateMap.chain(parsedState, 'Load sample conference');
  } else if (selection.includes('Load saved conference')) {
    console.log(green('\nLoad successful!'));

    stateMap.set('undo', 'Load saved conference');

    return stateMap.chain(parsedState, 'Load saved conference');
  }

  return 1;
}

module.exports = { loadFromFile };
