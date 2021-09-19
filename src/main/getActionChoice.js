const { bold } = require('chalk');
const { prompt, Separator } = require('inquirer');
const { stateMap } = require('../state');

async function getActionChoice(completedTrackNum, talks) {
  const input = {
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: ['Add a talk'],
    loop: false,
  };

  if (talks.length) {
    const { rawName: key } = talks[talks.length - 1];

    if (stateMap.has(key)) {
      input.choices.push(`Remove "${key}"`);
    }
  }

  if (stateMap.get('undo')) {
    if (
      stateMap.get('undo').includes('Load saved conference') ||
      stateMap.get('undo').includes('Load sample conference')
    ) {
      input.choices.push(`Undo "${stateMap.get('undo')}"`);
    } else {
      input.choices.push(`Undo removing "${stateMap.get('undo')}"`);
    }
  }

  if (completedTrackNum) {
    input.choices.push(
      new Separator(),
      `Print completed track${completedTrackNum > 1 ? 's' : ''} (${bold(
        completedTrackNum,
      )}) to screen`,
      'Write conference to CSV file',
      'List talks added so far',
      new Separator(),
    );
  }

  if (!completedTrackNum && talks.length) {
    input.choices.push('List talks added so far');
  }

  if (!completedTrackNum) {
    input.choices.push(new Separator());
  }

  input.choices.push('Load from file');

  if (talks.length) {
    input.choices.push('Save to file');
  }

  input.choices.push(new Separator(), 'Exit');

  const { selection } = await prompt(input);
  const [choice] = selection.split(' ');

  return choice;
}

module.exports = { getActionChoice };
