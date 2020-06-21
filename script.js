const CHARACTERS = 'IT%IS%HALF%%A%QUARTER%TWENTYFIVE%TEN%PAST%TOONETWOTHREEFOURFIVESIXSEVENELEVENTWELVE%NINE%EIGHT%TEN%OCLOCK%AMPM';

const CLOCK = {
  IT: [0, 1],
  IS: [3, 4],
  O_CLOCK: [99, 100, 101, 102, 103, 104],
  AM: [106, 107],
  PM: [108, 109],
}

const MINUTES = {
  FIVE: [28, 29, 30, 31],
  TEN: [33, 34, 35],
  A_QUARTER: [12, 14, 15, 16, 17, 18, 19, 20],
  TWENTY: [22, 23, 24, 25, 26, 27],
  TWENTYFIVE: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
  HALF: [6, 7, 8, 9],
}

const DIRECTION = {
  ZERO: [],
  PAST: [37, 38, 39, 40],
  TO: [42, 43],
}

const HOURS = {
  ONE: [44, 45, 46],
  TWO: [47, 48, 49],
  THREE: [50, 51, 52, 53, 54],
  FOUR: [55, 56, 57, 58],
  FIVE: [59, 60, 61, 62],
  SIX: [63, 64, 65],
  SEVEN: [66, 67, 68, 69, 70],
  EIGHT: [89, 90, 91, 92, 93],
  NINE: [84, 85, 86, 87],
  TEN: [95, 96, 97],
  ELEVEN: [71, 72, 73, 74, 75, 76],
  TWELVE: [77, 78, 79, 80, 81, 82],
}

const FIRST_DIGIT = [
  [1, 2, 3, 11, 15, 22, 26, 33, 37, 44, 48, 55, 59, 66, 70, 77, 81, 89, 90, 91],
  [0, 11, 22, 33, 44, 55, 66, 77, 88],
  [1, 2, 3, 11, 15, 26, 37, 45, 46, 47, 55, 66, 77, 88, 89, 90, 91, 92],
  [1, 2, 3, 11, 15, 26, 37, 45, 46, 47, 59, 70, 77, 81, 89, 90, 91],
  [0, 4, 11, 15, 22, 26, 33, 37, 44, 45, 46, 47, 48, 59, 70, 81, 92],
  [0, 1, 2, 3, 4, 11, 22, 33, 44, 45, 46, 47, 59, 70, 77, 81, 89, 90, 91],
];

const SECOND_DIGIT = [
  [7, 8, 9, 17, 21, 28, 32, 39, 43, 50, 54, 61, 65, 72, 76, 83, 87, 95, 96, 97],
  [6, 17, 28, 39, 50, 61, 72, 83, 94],
  [7, 8, 9, 17, 21, 32, 43, 51, 52, 53, 61, 72, 83, 94, 95, 96, 97, 98],
  [7, 8, 9, 17, 21, 32, 43, 51, 52, 53, 65, 76, 83, 87, 95, 96, 97],
  [6, 10, 17, 21, 28, 32, 39, 43, 50, 51, 52, 53, 54, 65, 76, 87, 98],
  [6, 7, 8, 9, 10, 17, 28, 39, 50, 51, 52, 53, 65, 76, 83, 87, 95, 96, 97],
  [7, 8, 9, 17, 21, 28, 39, 50, 51, 52, 53, 61, 65, 72, 76, 83, 87, 95, 96, 97],
  [6, 7, 8, 9, 10, 21, 32, 43, 54, 65, 76, 87, 98],
  [7, 8, 9, 17, 21, 28, 32, 39, 43, 51, 52, 53, 61, 65, 72, 76, 83, 87, 95, 96, 97],
  [7, 8, 9, 17, 21, 28, 32, 39, 43, 51, 52, 53, 54, 65, 76, 83, 87, 95, 96, 97],
];

const grid = document.getElementById('grid');

function buildGrid() {
  const message = 'DONNIEDAMATOUX'.split('');
  grid.innerHTML = CHARACTERS.split('').map((ch) => {
    if (ch === '%') ch = message.shift();
    return `<li>${ch}</li>`;
  }).join('');
  grid.addEventListener('click', () => grid.classList.toggle('show-seconds'));
  return document.querySelectorAll('li');
}

function getTime() {
  const config = { hour: 'numeric', minute: 'numeric', hour12: true, second: '2-digit' };
  return new Date().toLocaleString('en-US', config).split(/[^\d\w]/);
}


function convertTime([ hours, minutes, seconds, ampm ]) {
  let hour = parseInt(hours);
  let direction = 'PAST';
  let minute5 = Math.round(parseInt(minutes) / 5) * 5;
  if (minute5 > 30) {
    direction = 'TO';
    minute5 = 60 - minute5;
    hour = hour === 12 ? 1 : hour + 1;
  }

  if (minute5 === 0) {
    direction = 'ZERO';
  }

  const humanHour = [null, 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE'][hour];
  const humanMinute = [null, 'FIVE', 'TEN', 'A_QUARTER', 'TWENTY', 'TWENTYFIVE', 'HALF'][minute5 / 5];
  const [firstDigit, secondDigit] = seconds.split('').map(Number);
  return {
    human: [].concat(CLOCK['IT'], CLOCK['IS'], MINUTES[humanMinute], DIRECTION[direction], HOURS[humanHour], CLOCK['O_CLOCK'], CLOCK[ampm]),
    seconds: [].concat(FIRST_DIGIT[firstDigit], SECOND_DIGIT[secondDigit]),
  }
}

const pixels = buildGrid();

function runClock() {
  const time = getTime();
  const { human, seconds } = convertTime(time);
  pixels.forEach((px, i) => {
    px.classList.toggle('on-clock', human.includes(i));
    px.classList.toggle('on-second', seconds.includes(i));
  });
  setTimeout(runClock, 1000);
}

runClock();