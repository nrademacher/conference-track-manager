const { bold, blueBright } = require('chalk');
const { APP_VERSION } = require('./constants');
const { main } = require('./main');

console.log(
  bold(
    blueBright(
      `\nWelcome to Conference Track Manager${
        APP_VERSION ? ` v${APP_VERSION}` : ''
      }!`,
    ),
  ),
);

main();
