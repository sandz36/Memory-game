const {
  messages,
  classes,
  gameControllers,
  events,
  gridDimensions,
  colorsArray,
  attributes,
} = require("./dom_strings");
const domElements = require("./dom_elements");

function updateTurnCountDisplay() {
  if (domElements.turnCounterElement) {
    domElements.turnCounterElement.textContent = messages.getTurnCountString(gameControllers.turnCount);
  }
}

function handleRevealedTiles(tile1, tile2, counter, tiles, feedback) {
  if (tile1.style.backgroundColor === tile2.style.backgroundColor) {
    handleMatch(tile1, tile2, counter, tiles, feedback);
  } else {
    handleMismatch(tile1, tile2);
  }
}

function handleMatch(tile1, tile2, counter, tiles, feedback) {
  counter -= 2;
  gameControllers.isAwaitingMove = true;
  setTimeout(() => {
    addMatchClass(tile1, tile2);
    tile1.classList.remove(classes.revealed);
    tile2.classList.remove(classes.revealed);

    if (checkAllTilesFlippedAndCounter(counter, tiles)) {
      feedback.textContent = `Congratulations! You've completed the game in ${gameControllers.turnCount} moves and ${gameControllers.elapsedTime.getMinutes()} minutes and ${gameControllers.elapsedTime.getSeconds()} seconds!`;
      feedback.style.visibility = classes.visible;
      stopTimer();
    }
    gameControllers.isAwaitingMove = false;
  }, 1000);
}

function handleMismatch(tile1, tile2) {
  gameControllers.isAwaitingMove = true;
  setTimeout(() => {
    handleMismatchedTiles(tile1, tile2);
    gameControllers.isAwaitingMove = false;
  }, 1000);
}

function updateTimer() {
  const currentTime = new Date();
  gameControllers.elapsedTime = new Date(currentTime - gameControllers.startTime);
  const minutes = gameControllers.elapsedTime.getMinutes();
  const seconds = gameControllers.elapsedTime.getSeconds();
  domElements.timeElement.textContent = `Time: ${minutes} min ${seconds} sec`;
}

function startTimer() {
  gameControllers.startTime = new Date();
  gameControllers.timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(gameControllers.timerInterval);
}

function resetGameState() {
  domElements.tilesContainer.innerHTML = "";
  domElements.restartButton.style.visibility = classes.hidden;
  domElements.feedback.style.visibility = classes.hidden;
  stopTimer();
  gameControllers.isFirstClick = true;
  domElements.timeElement.textContent = " ";
  gameControllers.turnCount = 0;
  updateTurnCountDisplay();
}

function handleClick(event) {
  const tiles = domElements.getTiles();
  let counter = tiles.length;
  const tile = event.target;
  if (gameControllers.isAwaitingMove || isTileRevealedOrMatched(tile)) return;

  addRevealClassPush(tile);
  const revealedTiles = getRevealedTiles();
  gameControllers.turnCount++;

  if (revealedTiles.length === 2) {
    updateTurnCountDisplay();
    const tile1 = domElements.getTileById(revealedTiles[0].id);
    const tile2 = domElements.getTileById(revealedTiles[1].id);
    handleRevealedTiles(tile1, tile2, counter, tiles, domElements.feedback);
  }

  if (gameControllers.isFirstClick) {
    startTimerOnFirstClick();
  }
}

function setGridSize(rows, columns) {
  const height = gridDimensions.heights[rows] || "auto";
  const width = gridDimensions.widths[columns] || "auto";
  domElements.tilesContainer.style.width = width;
  domElements.tilesContainer.style.height = height;
  return domElements.tilesContainer;
}

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

domElements.restartButton.addEventListener(events.click, () => {
  resetGameState();
  const rows = parseInt(domElements.rowInput.value);
  const columns = parseInt(domElements.columnInput.value);
  shuffleTiles(rows, columns);
});

function startTimerOnFirstClick() {
  startTimer();
  domElements.restartButton.style.visibility = classes.visible;
  gameControllers.isFirstClick = false;
}

function isTileRevealedOrMatched(tile) {
  return tile.classList.contains(classes.revealed) || tile.classList.contains(classes.match);
}

function addRevealClassPush(tile) {
  if (getRevealedTiles().length < 2) {
    tile.classList.add(classes.revealed);
  }
}

function addMatchClass(tile1, tile2) {
  tile1.classList.add(classes.match);
  tile2.classList.add(classes.match);
}

function checkAllTilesFlippedAndCounter(counter, tiles) {
  return [...tiles].every(tile => tile.classList.contains(classes.match)) || counter === 0;
}

function handleMismatchedTiles(tile1, tile2) {
  tile1.classList.remove(classes.revealed);
  tile2.classList.remove(classes.revealed);
}

function getRevealedTiles() {
  return [...domElements.getTiles()].filter(tile => tile.classList.contains(classes.revealed) && !tile.classList.contains(classes.matched));
}

module.exports = {
  isTileRevealedOrMatched,
  addRevealClassPush,
  addMatchClass,
  checkAllTilesFlippedAndCounter,
  handleMismatchedTiles,
  getRevealedTiles,
  updateTurnCountDisplay,
  handleRevealedTiles,
  handleMatch,
  handleMismatch,
  startTimerOnFirstClick,
  resetGameState,
  shuffleTiles,
  setGridSize,
  buildTile,
  handleClick,
};
