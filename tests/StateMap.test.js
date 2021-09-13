const { StateMap } = require('../src/state/StateMap');

describe('StateMap instanced with initial state', () => {
  it('does not allow changes to the initState property', () => {
    const initState = { foo: 'bar', bar: 42, baz: [] };
    const stateMap = new StateMap(initState);

    stateMap.initState.foo = {};
    stateMap.initState.bar = 'test';
    stateMap.initState.baz = null;

    expect(stateMap.initState.foo).toStrictEqual('bar');
    expect(stateMap.initState.bar).toStrictEqual(42);
    expect(stateMap.initState.baz).toStrictEqual([]);
  });

  it('sets the key "default" to the initial state', () => {
    const initState = { foo: 'bar', bar: 42, baz: [] };
    const stateMap = new StateMap(initState);

    const result = stateMap.get('default');

    expect(result).toStrictEqual(initState);
  });
});

describe('the isState method', () => {
  it('correctly identifes state', () => {
    const initState = { foo: 'bar', bar: 42, baz: [] };
    const testStateOne = {
      foo: 'bar',
      bar: ['Foo', { Bar: 'Baz' }],
      testing: {},
    };
    const testStateTwo = {
      foo: 'bar',
      bar: [42, { Bar: 'Baz' }],
      baz: ['Foo', { Bar: 'Baz' }],
    };
    const testStateThree = {
      foo: 'bar',
      bar: [42, { Bar: 'Baz' }],
    };
    const stateMap = new StateMap(initState);

    const resultOne = stateMap.isState(testStateOne);
    const resultTwo = stateMap.isState(testStateTwo);
    const resultThree = stateMap.isState(testStateThree);

    expect(resultOne).toStrictEqual(false);
    expect(resultTwo).toStrictEqual(true);
    expect(resultThree).toStrictEqual(false);
  });
});

describe('the resolve method', () => {
  it('it correctly resolves a chain of state keys', () => {
    const initState = { foo: 'bar', bar: 42, baz: [] };
    const stateMap = new StateMap(initState);

    stateMap.set('Foo', 'default');
    stateMap.set('Bar', 'Foo');
    stateMap.set('Baz', 'Bar');

    const result = stateMap.resolve('Baz');

    expect(result).toStrictEqual(initState);
  });
});

describe('the chain method', () => {
  it('it adds new state and maps it to the key "current"', () => {
    const initState = { foo: 'bar', bar: 42, baz: [] };
    const newState = { foo: 'bar', bar: 42, baz: ['bar', 42] };
    const stateMap = new StateMap(initState);

    stateMap.chain(newState);
    const result = stateMap.resolve('current');

    expect(result).toStrictEqual(newState);
  });

  it('maps the previous state to the key "previous"', () => {
    const initState = { foo: 'bar', bar: 42, baz: [] };
    const newState = { foo: 'bar', bar: 42, baz: ['bar', 42] };
    const stateMap = new StateMap(initState);

    stateMap.chain(newState);
    const result = stateMap.resolve('previous');

    expect(result).toStrictEqual(initState);
  });

  it('optionally maps the previous state to any given key', () => {
    const initState = { foo: 'bar', bar: 42, baz: [] };
    const newState = { foo: 'bar', bar: 42, baz: ['bar', 42] };
    const stateMap = new StateMap(initState);

    stateMap.chain(newState, 'foo');
    const result = stateMap.resolve('foo');

    expect(result).toStrictEqual(initState);
  });
});
