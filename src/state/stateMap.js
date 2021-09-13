class StateMap extends Map {
  constructor(state) {
    super();
    this.initState = Object.freeze({ ...state });
    this.set('default', this.initState);
    this.set('current', 'default');
  }

  isState(obj) {
    return (
      Object.keys(obj).length === Object.keys(this.initState).length &&
      Object.keys(this.initState).every((key) => Object.prototype.hasOwnProperty.call(obj, key),
      )
    );
  }

  resolve(key) {
    const result = this.get(key);

    if (this.isState(result)) {
      return result;
    }
    if (this.has(result)) {
      return this.resolve(result);
    }

    return false;
  }

  chain(newState, key = Date.now()) {
    const prevState = this.resolve('current');

    if (this.isState(newState) && this.isState(prevState)) {
      this.set(key, { ...prevState });
      this.set('previous', key);
      this.set('current', { ...newState });

      return newState;
    }

    return 1;
  }
}

module.exports = { StateMap };
