const selectors = {
  tilesContainer: ".tiles",
  tiles: ".tile",
  restart: ".restart",
  feedback: ".feedback",
  start: "startGame",
  row: "rows",
  column: "columns",
  timeElement: "timer",
  turnCount: "turnCounter",
};

const messages = {
  alertMessage:
    "Total number of tiles cannot be 9. Please choose different dimensions.",
  congratulationsMessage:
    "Congratulations! You've completed the game in 12 moves and 0 minutes and 6 seconds!",
  getTurnCountString: (turnCount) => `Turn Count: ${turnCount}`,
};

const attributes = {
  div: "div",
  tile: "tile",
  colorData: "data-color",
  id: "id",
};

const classes = {
  revealed: "revealed",
  match: "match",
  visible: "visible",
  hidden: "hidden",
};

const colorsArray = [
  "red",
  "orange",
  "purple",
  "brown",
  "green",
  "pink",
  "yellow",
  "white",
];

const events = {
  click: "click",
};

const gameControllers = {
  turnCount: 0,
  startTime: null,
  timerInterval: null,
  elapsedTime: null,
  isFirstClick: true,
  isAwaitingMove: false,
};

const gridDimensions = {
   heights :  {
    2: "175px",
    3: "265px",
    4: "350px",
  },

   widths : {
    2: "180px",
    3: "270px",
    4: "345px",
  }
}


module.exports = {
  selectors,
  messages,
  attributes,
  classes,
  colorsArray,
  events,
  gameControllers,
  gridDimensions,
};
