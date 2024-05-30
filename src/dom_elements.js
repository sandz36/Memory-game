const { selectors } = require("./helper_objects");

const domElements = {
  tilesContainer: document.querySelector(selectors.tilesContainer),
  restartButton: document.querySelector(selectors.restart),
  feedback: document.querySelector(selectors.feedback),
  startGameElement: document.getElementById(selectors.start),
  turnCounterElement: document.getElementById(selectors.turnCount),
  timeElement: document.getElementById(selectors.timeElement),
  rowInput: document.getElementById(selectors.row),
  columnInput: document.getElementById(selectors.column),
  getTiles: () => document.querySelectorAll(selectors.tiles),
  getTileById: (id) => document.getElementById(id),
};

module.exports = domElements;
