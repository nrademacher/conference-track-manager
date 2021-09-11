class StateMap extends Map {
  constructor(state) {
    super();
    this.initState = Object.freeze(state);
    this.set('default', this.initState);
    this.set('current', this.initState);
  }

  chain(newState, key = Date.now(), oldState = this.get('current')) {
    this.set(key, { ...oldState });
    this.set('previous', { ...oldState });
    this.set('current', { ...newState });

    return { newState, key, oldState };
  }

  resolve(key) {
    const res = this.get(key);

    if (typeof res === 'object') {
      return res;
    }
    if (res || Number.isInteger(res)) {
      return this.resolve(res);
    }
    return false;
  }
}

module.exports = { StateMap };
