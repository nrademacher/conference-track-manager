const { StateMap } = require('./stateMap');
const { initState } = require('./initState');

module.exports = { stateMap: new StateMap(initState) };
