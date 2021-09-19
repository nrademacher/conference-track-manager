const { map } = require('./map');

function useStateKey(stateKey = map.get('current')) {
  const state = map.resolve(stateKey);

  const chainState = (newState) => map.chain(newState, stateKey);

  const keyExists = (key = stateKey) => map.has(key);

  const getValue = (key = stateKey) => map.get(key);

  const setProxyKey = (proxyKey, key = stateKey) => map.set(proxyKey, key);

  const discardKey = (key = stateKey) => map.delete(key);

  return {
    state,
    chainState,
    getValue,
    keyExists,
    discardKey,
    setProxyKey,
  };
}

module.exports = { useStateKey };
