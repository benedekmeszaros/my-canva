const colors = [
  { r: 105, g: 210, b: 231 },
  { r: 127, g: 188, b: 140 },
  { r: 227, g: 160, b: 24 },
  { r: 255, g: 107, b: 107 },
  { r: 255, g: 105, b: 180 },
  { r: 151, g: 35, b: 201 },
];
const offsetTime = 1; // Prelaz između dve boje u sekundama (s)
const interval = 5; // Interval između dve promene boje u sekundama (s)
const background = document.body;
const step = 5;
let id;
let colorIndex;
let t;
let targetColor;
let oldColor;

init();

// Podesavanje podrazumevanih vrednosti
function init() {
  colorIndex = nextIndex(-1);
  targetColor = colors[colorIndex];
  background.style.backgroundColor = extractColor(targetColor);
  id = setInterval(changeColor, interval * 1000);
}

// Odabir različitog slučajnog indeksa
function nextIndex(oldIndex) {
  let index;
  do {
    index = Math.floor(Math.random() * (colors.length - 1));
  } while (index === oldIndex);
  return index;
}

// Objekat u boju
function extractColor(color) {
  return `rgb(${color.r},${color.g},${color.b})`;
}

// Odabir nove boje
function changeColor() {
  clearInterval(id);
  oldColor = targetColor;
  colorIndex = nextIndex(colorIndex);
  targetColor = colors[colorIndex];
  t = 0.0;
  id = setInterval(transition, step);
}

// Vraća vrednost između start i end na osnovu t vrednosti, gde je t = [0,1]
function lerp(start, end, t) {
  return start + t * (end - start);
}

// Prelaz boje
function transition() {
  if (t < offsetTime) {
    t += step / 1000;
    let currentColor = {
      r: lerp(oldColor.r, targetColor.r, t / offsetTime),
      g: lerp(oldColor.g, targetColor.g, t / offsetTime),
      b: lerp(oldColor.b, targetColor.b, t / offsetTime),
    };
    background.style.backgroundColor = extractColor(currentColor);
  } else {
    background.style.backgroundColor = extractColor(targetColor);
    clearInterval(id);
    id = setInterval(changeColor, interval * 1000);
  }
}
