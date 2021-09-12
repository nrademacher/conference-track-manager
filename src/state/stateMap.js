class StateMap extends Map {
  constructor(state) {
    super();
    this.initState = Object.freeze({ ...state });
    this.set('default', this.initState);
    this.set('current', this.initState);
  }

  isState(obj) {
    return (
      Object.keys(obj).length === Object.keys(this.initState).length &&
      Object.keys(obj).every((key) => this.initState.hasOwnProperty(key))
    );
  }

  chain(newState, key = Date.now(), prevState = this.get('current')) {
    this.set(key, { ...prevState });
    this.set('previous', key);
    this.set('current', { ...newState });

    return newState;
  }

  resolve(key) {
    const res = this.get(key);

    if (this.isState(res)) {
      return res;
    }
    if (this.has(res)) {
      return this.resolve(res);
    }
    return false;
  }
}

module.exports = { StateMap };
