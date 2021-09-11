function incrementTime(timeStr, minsNum) {
  const digitStr = timeStr.slice(0, timeStr.length - 2);
  const digits = digitStr.split(':');
  let indicator = timeStr.slice(5);
  let hours = Number(digits[0]);
  let mins = Number(digits[1]);
  let minsAdded = minsNum;

  while (mins + minsAdded >= 60) {
    if (hours + 1 === 12) {
      if (indicator === 'AM') {
        indicator = 'PM';
      } else if (indicator === 'PM') {
        indicator = 'AM';
      }
    }

    if (hours + 1 === 13) {
      hours = 1;
    } else {
      hours += 1;
    }
    minsAdded -= 60;
  }

  mins += minsAdded;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (mins < 10) {
    mins = `0${mins}`;
  }

  return `${hours}:${mins}${indicator}`;
}

module.exports = { incrementTime };
