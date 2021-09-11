const { StateMap } = require('./stateMap');
const { initState } = require('./initState');

const stateMap = new StateMap(initState);

module.exports = { stateMap };
