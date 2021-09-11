const { APP_VERSION } = require('./constants');

function init() {
  console.log(
    `\nWelcome to Conference Track Manager${
      APP_VERSION ? ` v${APP_VERSION}` : ''
    }!`,
  );

  return 0;
}

init();
