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

  if (talks.length && stateMap.has(talks.slice(-1)[0].rawName)) {
    input.choices.push(`Undo adding "${talks.slice(-1)[0].rawName}"`);
  }

  if (stateMap.get('undo')) {
    input.choices.push(`Redo adding "${stateMap.get('undo')}"`);
  }

  if (completedTrackNum) {
    input.choices.push(
      new Separator(),
      `Print completed track${completedTrackNum > 1 ? 's' : ''} (${bold(
        completedTrackNum,
      )}) to screen`,
      'Write conference to CSV file',
      new Separator(),
    );
  }

  if (!completedTrackNum && talks.length) {
    input.choices.push('View talks added so far');
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
