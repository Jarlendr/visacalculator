'use strict';

////////////////////////////////////////////////////////
//////               EVENT LISTENERS              //////
////////////////////////////////////////////////////////

// Listens to a change in all 'input-type = date' elements.
// When a user inputs any date, the event listener will activate
// the dateGetter function.
document.addEventListener('change', (el) => {
  if (el.target.type == 'date') {
    dateGetter(el);
  }
});

// Clicking the button will activate the calculation of all dates,
// to determine if the planned stay exceeds the
// permitted 90 days of staying in Schengen.
document
  .getElementById('counter--button')
  .addEventListener('click', () => {
    if (
      isNaN(
        document.getElementsByClassName('date')[0].children[1].value
      ) &&
      isNaN(
        document.getElementsByClassName('date')[0].children[3].value
      )
    ) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      updateCounterVisual();
    }
  });

// Clicking the '+' button will add another 'previous stay'
// date card to the DOM.
document
  .getElementsByClassName('add')[0]
  .addEventListener('click', () => {
    addDateCard();
  });

// Clicking the '-' button will remove the last 'previous stay'
// date card from the DOM.

document
  .getElementsByClassName('remove')[0]
  .addEventListener('click', () => {
    const children = document.getElementsByClassName('prev');
    if (children.length > 1) {
      removeFadeOut(
        document.getElementById('prev--stays').lastElementChild,
        200
      );
    }
  });

////////////////////////////////////////////////////////
//////                  FUNCTIONS                 //////
////////////////////////////////////////////////////////

// Adds a date card to the DOM
const addDateCard = () => {
  const calendarTemplate = document
      .getElementsByTagName('form')[1]
      .cloneNode(true),
    calendarContainer = document.getElementById('prev--stays');

  calendarTemplate.className = 'date prev';
  calendarContainer.appendChild(calendarTemplate);

  // colorPicker(calendarContainer.lastElementChild);
  document
    .getElementById('date--buttons')
    .scrollIntoView({ behavior: 'smooth', block: 'end' });
};

// Adds an animation upon removing a DOM element.
const removeFadeOut = (el, speed) => {
  let seconds = speed / 1000;
  el.style.animation = 'remove-animate ' + seconds + 's linear';

  setTimeout(function () {
    el.parentNode.removeChild(el);
  }, speed);
};

// Randomly picks between colours in a colour array 'arr'.
// Look at :root in styles.css to see or change the colours.
const colorPicker = (
  el,
  arr = ['--aqua', '--yellow', '--purple', '--pink', '--green']
) => {
  return (el.style.borderLeft =
    '1em solid ' +
    getComputedStyle(document.documentElement).getPropertyValue(
      arr[Math.floor(Math.random() * arr.length)]
    ));
};

// Takes a date event element, checks if both date inputs are valid,
// calculates amount of days between the two dates and returns
// a DOM element.
const dateGetter = (el) => {
  if (
    isNaN(Date.parse(el.target.parentNode.children[1].value)) ||
    isNaN(Date.parse(el.target.parentNode.children[3].value))
  ) {
    return false;
  }
  let start = new Date(el.target.parentNode.children[1].value),
    end = new Date(el.target.parentNode.children[3].value),
    duration = dateDuration(start, end);
  if (duration === 1) {
    return (el.target.parentNode.children[4].children[0].innerHTML =
      duration + ' day');
  } else
    return (el.target.parentNode.children[4].children[0].innerHTML =
      duration + ' days');
};

// Returns the amount of days between two dates
const dateDuration = (dateEnd, dateStart) => {
  if (dateEnd < dateStart) {
    return (dateStart - dateEnd) / (1000 * 60 * 60 * 24) + 1;
  } else return (dateEnd - dateStart) / (1000 * 60 * 60 * 24) + 1;
};

// Subtracts a specified number of days from a date
const subtractDays = (date, days = 1) => {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
};

// Adds a specified numbers of days to a date
const addDays = (date, days = 1) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Returns an array of dates determined by start and end dates
const dateRange = (start, end, range = []) => {
  if (start > end) return range;
  const next = addDays(start, 1);
  return dateRange(next, end, [...range, start]);
};

// Returns an array of objects containing all user inputted dates
const arrObjMaker = () => {
  const dateLen = document.getElementsByClassName('date').length,
    dateArr = [];
  for (let i = 0; i < dateLen; i++) {
    let start = new Date(
        document.getElementsByClassName('date')[i].children[1].value
      ),
      end = new Date(
        document.getElementsByClassName('date')[i].children[3].value
      );
    if (
      i === 1 ||
      isNaN(Date.parse(start)) ||
      isNaN(Date.parse(end))
    ) {
      continue;
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    dateArr.push({
      start: start,
      end: end,
    });
  }
  return dateArr;
};

// Takes two arrays of dates and returns the amount of days they share
const arrCompare = (arr1, arr2) => {
  let days = 0;
  const arr1Len = arr1.length,
    arr2Len = arr2.length;

  for (let i = 0; i < arr1Len; i++) {
    for (let j = 0; j < arr2Len; j++) {
      if (arr1[i].getTime() === arr2[j].getTime()) {
        days++;
      }
    }
  }
  return days;
};

// Takes the planned stay date range, and starting from the first day
// of the planned stay, checks 180 days back to determine how many
// intersecting days there are between the planned stay and the
// previous stays. Will return the total number of intersecting days.
const ninetyDays = () => {
  const dateArr = arrObjMaker(),
    dateArrLen = dateArr.length,
    plannedStay = dateRange(dateArr[0].start, dateArr[0].end),
    plannedStayLen = plannedStay.length;
  let days = [0, false];

  for (let i = 0; i < plannedStayLen; i++) {
    days[0] = 0;
    for (let j = 0; j < dateArrLen; j++) {
      const previousStay = dateRange(
        dateArr[j].start,
        dateArr[j].end
      );

      days[0] += arrCompare(
        dateRange(subtractDays(plannedStay[i], 179), plannedStay[i]),
        previousStay
      );
      if (days[0] === 90) {
        days[1] = plannedStay[i].toLocaleDateString();
      }
    }
  }
  return days;
};

// Displays the total amount of days spent in the country/zone at the
// end of the planned stay
const updateCounterVisual = (days = ninetyDays()) => {
  const percent = percentCalculator(days[0]);
  circleAnimate(percent, days[1]);
  return (document.getElementById('days').innerHTML = days[0]);
};

// Calculates a percentage where 100% = 90 days and 0% = 0 days
const percentCalculator = (days) => {
  if (days >= 90) {
    return 100;
  }
  return (days / 90) * 100;
};

// Animations and colors the circle path
const circleAnimate = (
  percent = percentCalculator(),
  exceed = false
) => {
  const circle = document.getElementById('circle');
  circle.setAttribute('stroke-dasharray', percent + ' 100');
  circle.style.animation =
    'progress ' + circleSpeed(percent) + 's ease-out forwards';

  setTimeout(function () {
    circle.style.removeProperty('animation');
  }, circleSpeed(percent) * 1000);
  colorPage(percent, exceed);
};

// Determines speed of circle path
const circleSpeed = (percent = percentCalculator()) => {
  if (percent <= 33) {
    return 0.5;
  } else if (percent > 33 && percent <= 66) {
    return 1;
  } else return 1.5;
};

// Determines a color depending on percentage
const colorPage = (percent = percentCalculator(), exceed = false) => {
  const color = document.documentElement.style;
  const text = document.getElementById('info--text');
  if (percent >= 90 && percent < 100) {
    color.setProperty('--main', 'rgb(255, 173, 79)');
    color.setProperty('--accent', 'rgb(187, 100, 0)');
    text.innerHTML =
      'You will be close to overstaying. Consider altering your travel plans';
  } else if (percent >= 100 || exceed != false) {
    color.setProperty('--main', 'rgb(255, 79, 79)');
    color.setProperty('--accent', 'rgb(197, 27, 27)');
    text.innerHTML =
      'You will overstay on ' +
      exceed +
      '. You should alter your travel plans!';
  } else {
    color.setProperty('--main', 'rgb(79, 161, 255)');
    color.setProperty('--accent', 'rgb(0, 119, 255)');
    text.innerHTML = 'You are not at risk of overstaying';
  }
};
