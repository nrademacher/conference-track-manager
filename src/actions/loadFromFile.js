const { prompt, Separator } = require('inquirer');
const { existsSync, readFileSync } = require('fs');
const { green, red } = require('chalk');
const { useStateKey } = require('../state');

async function loadFromFile() {
  const { setProxyKey, chainState } = useStateKey();

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

    setProxyKey('Load a sample conference');
    setProxyKey('undo', 'Load a sample conference');

    return chainState(parsedState);
  } else if (selection.includes('Load saved conference')) {
    console.log(green('\nLoad successful!'));

    setProxyKey('Load saved conference');
    setProxyKey('undo', 'Load saved conference');

    return chainState(parsedState);
  }

  return 1;
}

module.exports = { loadFromFile };
