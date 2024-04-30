const strings = require("./dom_strings");
const {
  isTileRevealedOrMatched,
  addRevealClassPush,
  addMatchClass,
  checkAllTilesFlippedAndCounter,
  handleMismatchedTiles,
  getRevealedTiles,
} = require("./dom_helpers");

function buildTile(color, id) {
  const element = document.createElement(strings.div);
  element.classList.add(strings.tile);
  element.setAttribute(strings.colorData, color);
  element.setAttribute(strings.id, id);
  element.style.background = color;
  return element;
}

function shuffleTiles(rows, columns) {
  const tilesContainer = setGridSize(rows, columns);
  const total = rows * columns;
  const colors = strings.colors.slice(0, total / 2);
  const colorsPickList = [...colors, ...colors];
  const tileCount = colorsPickList.length;
  for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * colorsPickList.length);
    const color = colorsPickList[randomIndex];
    const tile = buildTile(color, i);
    tile.addEventListener(strings.click, handleClick);
    colorsPickList.splice(randomIndex, 1);
    tilesContainer.appendChild(tile);
  }
}

function setGridSize(rows, columns) {
  const tilesContainer = document.querySelector(strings.tilesContainer);

  const heights = {
    2: "180px",
    3: "260px",
    4: "300px",
  };

  const widths = {
    2: "190px",
    3: "260px",
    4: "300px",
  };

  const height = heights[rows] || "auto";
  const width = widths[columns] || "auto";

  tilesContainer.style.width = width;
  tilesContainer.style.height = height;
  return tilesContainer;
}

function startGame() {
  const rows = parseInt(document.getElementById(strings.row).value);
  const columns = parseInt(document.getElementById(strings.column).value);
  shuffleTiles(rows, columns);
}

let startGameElement = document.getElementById(strings.start);
startGameElement.addEventListener(strings.click, function (event) {
  event.preventDefault();
  resetGameState();
  startGame();
});

let restartButton = document.querySelector(strings.restart);
restartButton.addEventListener(strings.click, () => {
  resetGameState();
  const rows = parseInt(document.getElementById(strings.row).value);
  const columns = parseInt(document.getElementById(strings.column).value);
  shuffleTiles(rows, columns);
});

function handleClick(event) {
  const tiles = document.querySelectorAll(strings.tiles);
  let counter = tiles.length;
  const total = tiles.length;
  const tile = event.target;
  if (isTileRevealedOrMatched(tile)) {
    return;
  }

  addRevealClassPush(tile);
  const revealedTiles = getRevealedTiles();

  if (revealedTiles.length === 2) {
    const feedback = document.querySelector(strings.feedback);
    const tile1 = document.getElementById(revealedTiles[0].id);
    const tile2 = document.getElementById(revealedTiles[1].id);

    if (tile1.style.backgroundColor === tile2.style.backgroundColor) {
      counter -= 2;
      setTimeout(() => {
        addMatchClass(tile1, tile2);
        tile1.classList.remove(strings.revealed);
        tile2.classList.remove(strings.revealed);

        if (counter === total - 2) {
          restartButton.style.visibility = strings.visible;
        }
        if (checkAllTilesFlippedAndCounter(counter, tiles)) {
          feedback.style.visibility = strings.visible;
        }
      }, 1000);
    } else {
      setTimeout(() => {
        handleMismatchedTiles(tile1, tile2);
      }, 1000);
    }
  }
}

function resetGameState() {
  const feedback = document.querySelector(strings.feedback);
  let restartButton = document.querySelector(strings.restart);
  const tilesContainer = document.querySelector(strings.tilesContainer);

  let tiles = document.querySelectorAll(strings.tiles);
  tilesContainer.innerHTML = "";
  restartButton.style.visibility = strings.hidden;
  counter = tiles.length;
  feedback.style.visibility = strings.hidden;
}

module.exports = {
  handleClick,
  shuffleTiles,
  startGame,
  startGameElement,
  restartButton,
  resetGameState,
};
