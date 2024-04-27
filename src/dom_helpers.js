function isTileRevealedOrMatched(tile) {
  if (
    tile.classList.contains(strings.revealed) ||
    tile.classList.contains(strings.match)
  ) {
    return true;
  }
  return false;
}

function addRevealClassPush(tile) {
  const numberOfRevealedTiles = getRevealedTiles().length;

  if (numberOfRevealedTiles < 2) {
    tile.classList.add(strings.revealed);
  }
}

function addMatchClass(tile1, tile2) {
  tile1.classList.add(strings.match);
  tile2.classList.add(strings.match);
}

function checkAllTilesFlippedAndCounter(counter, tiles) {
  const tileArray = [...tiles];
  let allFlipped = tileArray.every((tile) =>
    tile.classList.contains(strings.match)
  );

  return allFlipped || counter === 0;
}
function handleMismatchedTiles(tile1, tile2) {
  tile1.classList.remove(strings.revealed);
  tile2.classList.remove(strings.revealed);
}

function getRevealedTiles() {
  const tiles = document.querySelectorAll(strings.tiles);

  return [...tiles].filter(
    (tile) =>
      tile.classList.contains(strings.revealed) &&
      !tile.classList.contains(strings.matched)
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
