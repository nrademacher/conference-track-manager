const { readFileSync } = require('fs');

let appVersion;

// Try to get app version to display at app start
try {
  const { version } = JSON.parse(readFileSync('package.json'));
  appVersion = version;
} catch {
  // Will not be displayed if falsy
  appVersion = false;
}

const APP_VERSION = appVersion;

module.exports = { APP_VERSION };
