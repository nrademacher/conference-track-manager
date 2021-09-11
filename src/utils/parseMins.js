function parseMins(minStr) {
  if (minStr === 'lightning') {
    return 5;
  }

  const [minutes] = minStr.split('min');

  if (!minutes.length || Number.isNaN(Number(minutes))) {
    return false;
  }

  return Number(minutes);
}

module.exports = { parseMins };
