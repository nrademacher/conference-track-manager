class StateMap extends Map {
  constructor(state) {
    super();
    this.initState = Object.freeze(state);
    this.set('default', this.initState);
    this.set('current', this.initState);
  }

  chain(newState, key = Date.now(), oldState = this.get('current')) {
    this.set(key, { ...oldState });
    this.set('previous', key);
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

  resolveVal(name, key = 'current') {
    const state = this.resolve(key);

    if (state[name]) {
      if (state[name] instanceof Array) {
        return state[name][state[name].length - 1];
      }
    }
  }
}

module.exports = { StateMap };
