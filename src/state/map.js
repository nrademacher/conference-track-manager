const { StateMap } = require('./StateMap');
const { initState } = require('./initState');

const map = new StateMap(initState);

module.exports = { map };
