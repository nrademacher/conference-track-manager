const { parseMins } = require('../src/utils');

describe('parseMins', () => {
  it('parses a single-digit integer from a string in the format "[number]mins', () => {
    const numStr = '7min';

    const result = parseMins(numStr);

    expect(result).toStrictEqual(7);
  });

  it('parses a double-digit integer from a string in the format "[number]mins', () => {
    const numStr = '42min';

    const result = parseMins(numStr);

    expect(result).toStrictEqual(42);
  });

  it('parses a three-digit integer from a string in the format "[number]mins', () => {
    const numStr = '123min';

    const result = parseMins(numStr);

    expect(result).toStrictEqual(123);
  });

  it('parses a large integer from a string in the format "[number]mins', () => {
    const numStr = '98234min';

    const result = parseMins(numStr);

    expect(result).toStrictEqual(98234);
  });

  it('returns 5 when passed the string "lightning"', () => {
    const lightningStr = 'lightning';

    const result = parseMins(lightningStr);

    expect(result).toStrictEqual(5);
  });
});
