const { bold } = require('chalk');
const { prompt, Separator } = require('inquirer');
const { useStateKey } = require('../state');

async function getActionChoice(completedTrackNum, talks) {
  const { getValue, keyExists } = useStateKey('current');

  const input = {
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: ['Add a talk'],
    loop: false,
  };

  if (talks.length) {
    const { rawName: key } = talks[talks.length - 1];

    if (keyExists(key)) {
      input.choices.push(`Remove "${key}"`);
    }
  }

  if (keyExists('undo')) {
    console.log(getValue('undo'));
    if (
      getValue('undo').includes('Load saved conference') ||
      getValue('undo').includes('Load a sample conference')
    ) {
      input.choices.push(`Undo "${getValue('undo')}"`);
    } else {
      input.choices.push(`Undo removing "${getValue('undo')}"`);
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
