const {
  selectors,
  messages,
  attributes,
  classes,
  colorsArray,
  events,
  gameControllers,
} = require("./dom_strings");
const {
  isTileRevealedOrMatched,
  addRevealClassPush,
  addMatchClass,
  checkAllTilesFlippedAndCounter,
  handleMismatchedTiles,
  getRevealedTiles,
} = require("./dom_helpers");


let startTime;
let timerInterval;
let elapsedTime;
let isFirstClick = true;
let isAwaitingMove = false;

function buildTile(color, id) {
  const element = document.createElement(attributes.div);
  element.classList.add(attributes.tile);
  element.setAttribute(attributes.colorData, color);
  element.setAttribute(attributes.id, id);
  element.style.background = color;
  return element;
}

function shuffleTiles(rows, columns) {
  const tilesContainer = setGridSize(rows, columns);
  const total = rows * columns;
  const colors = colorsArray.slice(0, total / 2);
  const colorsPickList = [...colors, ...colors];
  const tileCount = colorsPickList.length;
  for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * colorsPickList.length);
    const color = colorsPickList[randomIndex];
    const tile = buildTile(color, i);
    tile.addEventListener(events.click, handleClick);
    colorsPickList.splice(randomIndex, 1);
    tilesContainer.appendChild(tile);
  }
}

function setGridSize(rows, columns) {
  const tilesContainer = document.querySelector(selectors.tilesContainer);

  const heights = {
    2: "175px",
    3: "265px",
    4: "350px",
  };

  const widths = {
    2: "180px",
    3: "270px",
    4: "345px",
  };

  const height = heights[rows] || "auto";
  const width = widths[columns] || "auto";

  tilesContainer.style.width = width;
  tilesContainer.style.height = height;
  return tilesContainer;
}

function startGame() {
  const rows = parseInt(document.getElementById(selectors.row).value);
  const columns = parseInt(document.getElementById(selectors.column).value);
  if (rows * columns === 9) {
    displayErrorMessage(messages.alertMessage);
    return;
  }
  shuffleTiles(rows, columns);
  isFirstClick = true;
}

function displayErrorMessage(message) {
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.textContent = message;
  document.body.appendChild(errorMessage);

  setTimeout(() => {
    errorMessage.remove();
  }, 3000);
}

function startTimer() {
  startTime = new Date();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  const currentTime = new Date();
  elapsedTime = new Date(currentTime - startTime);
  const minutes = elapsedTime.getMinutes();
  const seconds = elapsedTime.getSeconds();
  document.getElementById(
    selectors.timeElement
  ).textContent = `Time: ${minutes} min ${seconds} sec`;
}

let startGameElement = document.getElementById(selectors.start);
startGameElement.addEventListener(events.click, function (event) {
  event.preventDefault();
  resetGameState();
  startGame();
});

let restartButton = document.querySelector(selectors.restart);
restartButton.addEventListener(events.click, () => {
  resetGameState();
  isFirstClick = true;
  const rows = parseInt(document.getElementById(selectors.row).value);
  const columns = parseInt(document.getElementById(selectors.column).value);
  shuffleTiles(rows, columns);
});

function handleClick(event) {
  const tiles = document.querySelectorAll(selectors.tiles);
  let counter = tiles.length;
  const tile = event.target;
  if (isAwaitingMove) {
    return;
  }
  if (isTileRevealedOrMatched(tile)) {
    return;
  }

  addRevealClassPush(tile);
  const revealedTiles = getRevealedTiles();
  gameControllers.turnCount++;

  if (revealedTiles.length === 2) {
    const turnCounterElement = document.getElementById(selectors.turnCount);
    if (turnCounterElement) {
      turnCounterElement.textContent = messages.getTurnCountString(gameControllers.turnCount);
    }

    const feedback = document.querySelector(selectors.feedback);
    const tile1 = document.getElementById(revealedTiles[0].id);
    const tile2 = document.getElementById(revealedTiles[1].id);
    if (tile1.style.backgroundColor === tile2.style.backgroundColor) {
      counter -= 2;
      isAwaitingMove = true;
      setTimeout(() => {
        addMatchClass(tile1, tile2);
        tile1.classList.remove(classes.revealed);
        tile2.classList.remove(classes.revealed);

        if (checkAllTilesFlippedAndCounter(counter, tiles)) {
          feedback.textContent = `Congratulations! You've completed the game in ${gameControllers.turnCount} moves and ${elapsedTime.getMinutes()} minutes and ${elapsedTime.getSeconds()} seconds!`;
          feedback.style.visibility = classes.visible;
          stopTimer();
        }
        isAwaitingMove = false;
      }, 1000);
    } else {
      isAwaitingMove = true;
      setTimeout(() => {
        handleMismatchedTiles(tile1, tile2);
        isAwaitingMove = false;
      }, 1000);
    }
  }

  if (isFirstClick) {
    startTimer();
    restartButton.style.visibility = classes.visible;
    isFirstClick = false;
  }
  return gameControllers.turnCount;
}

function resetGameState() {
  const feedback = document.querySelector(selectors.feedback);
  let restartButton = document.querySelector(selectors.restart);
  const tilesContainer = document.querySelector(selectors.tilesContainer);

  let tiles = document.querySelectorAll(selectors.tiles);
  tilesContainer.innerHTML = "";
  restartButton.style.visibility = classes.hidden;
  counter = tiles.length;
  feedback.style.visibility = classes.hidden;
  stopTimer();
  isFirstClick = true;
  document.getElementById(selectors.timeElement).textContent = " ";
  gameControllers.turnCount = 0;
  const turnCounterElement = document.getElementById(selectors.turnCount);
  if (turnCounterElement) {
    turnCounterElement.textContent = messages.getTurnCountString(gameControllers.turnCount);
  }
}

module.exports = {
  handleClick,
  shuffleTiles,
  startGame,
  startGameElement,
  restartButton,
  resetGameState,
};
