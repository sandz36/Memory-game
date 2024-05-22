const { selectors, classes } = require("./dom_strings");

function isTileRevealedOrMatched(tile) {
  if (
    tile.classList.contains(classes.revealed) ||
    tile.classList.contains(classes.match)
  ) {
    return true;
  }
  return false;
}

function addRevealClassPush(tile) {
  const numberOfRevealedTiles = getRevealedTiles().length;

  if (numberOfRevealedTiles < 2) {
    tile.classList.add(classes.revealed);
  }
}

function addMatchClass(tile1, tile2) {
  tile1.classList.add(classes.match);
  tile2.classList.add(classes.match);
}

function checkAllTilesFlippedAndCounter(counter, tiles) {
  const tileArray = [...tiles];
  const allFlipped = tileArray.every((tile) =>
    tile.classList.contains(classes.match)
  );

  return allFlipped || counter === 0;
}
function handleMismatchedTiles(tile1, tile2) {
  tile1.classList.remove(classes.revealed);
  tile2.classList.remove(classes.revealed);
}

function getRevealedTiles() {
  const tiles = document.querySelectorAll(selectors.tiles);

  return [...tiles].filter(
    (tile) =>
      tile.classList.contains(classes.revealed) &&
      !tile.classList.contains(classes.matched)
  );
}

module.exports = {
  isTileRevealedOrMatched,
  addRevealClassPush,
  addMatchClass,
  checkAllTilesFlippedAndCounter,
  handleMismatchedTiles,
  getRevealedTiles,
};
