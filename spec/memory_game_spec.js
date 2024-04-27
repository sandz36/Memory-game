const { setupJSDOM } = require("./jsdom_helper");
const strings = require("../src/dom_strings");

describe("Memory Game", () => {
  let tiles;
  let restartButton;

  beforeEach(() => {
    setupJSDOM();
    tiles = document.querySelectorAll(strings.tiles);
    restartButton = document.querySelector(strings.restart);
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  describe("shuffleTiles function", () => {
    it("should create tile elements", () => {
      expect(tiles.length).toBe(16);
      tiles.forEach((tile) => {
        expect(tile.classList.contains(strings.tile)).toBe(true);
        expect(tile.classList.contains(strings.revealed)).toBe(false);
        expect(tile.classList.contains(strings.match)).toBe(false);
      });
    });

    it("should not flip revealed tiles when clicked", () => {
      tiles[0].click();
      expect(tiles[0].classList.contains(strings.revealed)).toBe(true);
      tiles[0].click();
      expect(tiles[0].classList.contains(strings.revealed)).toBe(true);
    });

    it("should reveal color when a tile is clicked", () => {
      const tile = tiles[0];
      tile.click();
      expect(tile.classList.contains(strings.revealed)).toBe(true);
    });
  });

  describe("handleClick function", () => {
    it("should match two tiles with the same color", () => {
      tiles[0].style.background = "green";
      tiles[1].style.background = "green";
      tiles[0].click();
      tiles[1].click();
      jasmine.clock().tick(1000);

      expect(tiles[0].classList.contains(strings.match)).toBe(true);
      expect(tiles[1].classList.contains(strings.match)).toBe(true);
      expect(tiles[0].classList.contains(strings.revealed)).toBe(false);
      expect(tiles[1].classList.contains(strings.revealed)).toBe(false);
    });

    it("should mismatch two tiles with different colors", () => {
      tiles[3].style.background = "pink";
      tiles[2].style.background = "purple";
      tiles[3].click();
      tiles[2].click();
      jasmine.clock().tick(1001);
      expect(tiles[3].classList.contains(strings.match)).toBe(false);
      expect(tiles[2].classList.contains(strings.match)).toBe(false);
      expect(tiles[3].classList.contains(strings.revealed)).toBe(false);
      expect(tiles[2].classList.contains(strings.revealed)).toBe(false);
    });
  });

  describe("restartGameState function", () => {
    it("should display congratulations text when all tiles are matched", () => {
      let remainingColors = strings.colors;
      const congratulationsElement = document.querySelector(strings.feedback);

      for (let i = 0; i < tiles.length - 1; i += 2) {
        const color = remainingColors.pop();
        tiles[i].style.background = color;
        tiles[i + 1].style.background = color;
        tiles[i].click();
        tiles[i + 1].click();
        jasmine.clock().tick(1000);
      }

      tiles[14].style.background = "yellow";
      tiles[15].style.background = "yellow";
      tiles[14].click();
      tiles[15].click();
      jasmine.clock().tick(2000);
      expect(congratulationsElement.style.visibility).toBe(strings.visible);
    });

    it("should display restart button after the first card was clicked", function () {
      restartButton.style.visibility = strings.hidden;
      tiles[0].style.background = "green";
      tiles[1].style.background = "green";
      tiles[0].click();
      tiles[1].click();
      jasmine.clock().tick(1000);
      expect(restartButton.style.visibility).toBe(strings.visible);
    });

    it("should hide restart button after it was clicked", function () {
      restartButton.style.visibility = strings.visible;
      restartButton.click();
      jasmine.clock().tick(1000);
      expect(restartButton.style.visibility).toBe(strings.hidden);
    });

    it("should reset game to its initial state after reset button is clicked", function () {
      restartButton.style.visibility = strings.hidden;
      tiles[0].style.background = "red";
      tiles[1].style.background = "red";
      tiles[0].click();
      tiles[1].click();

      jasmine.clock().tick(1000);
      expect(tiles[0].classList).toContain(strings.match);
      expect(tiles[1].classList).toContain(strings.match);

      restartButton.click();

      expect(tiles[0].classList.contains(strings.tile));
      expect(tiles[1].classList.contains(strings.tile));
    });
  });
});
