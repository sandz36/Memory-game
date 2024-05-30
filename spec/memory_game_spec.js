const jsdom = require("jsdom");
const fs = require("fs");
const index = fs.readFileSync("index.html", "utf8");
const { JSDOM } = jsdom;
const { document } = new JSDOM(index).window;
global.document = document;

require("../src/memory_game");

const { messages, classes, attributes } = require("../src/helper_objects");
const domElements = require("../src/dom_elements");

describe("Memory Game", () => {
  let tiles;

  beforeEach(() => {
    const startDate = new Date();
    jasmine.clock().install();
    jasmine.clock().mockDate(startDate);

    tiles = domElements.getTiles();
    domElements.rowInput.value = "4";
    domElements.columnInput.value = "3";
    domElements.startGameElement.click();
    tiles = domElements.getTiles();
  });

  afterEach(() => {
    domElements.restartButton.click();
    jasmine.clock().uninstall();
  });

  describe("shuffleTiles function", () => {
    it("should not disable the 'StartGame' button after clicking it", () => {
      const selectGrid = domElements.startGameElement;

      selectGrid.click();

      expect(selectGrid.disabled).toBe(false);
      domElements.restartButton.click();
      expect(selectGrid.disabled).toBe(false);
    });

    it("should set the container height based on the number of rows", () => {
      const expectedHeight = "350px";
      expect(domElements.tilesContainer.style.height).toBe(expectedHeight);
    });

    it("should create tile elements as configured by user at start", () => {
      expect(tiles.length).toBe(12);
      tiles.forEach((tile) => {
        expect(tile.classList.contains(attributes.tile)).toBe(true);
        expect(tile.classList.contains(classes.revealed)).toBe(false);
        expect(tile.classList.contains(classes.match)).toBe(false);
      });
    });

    it("should not flip revealed tiles when clicked", () => {
      tiles[0].click();
      expect(tiles[0].classList.contains(classes.revealed)).toBe(true);
      tiles[0].click();
      expect(tiles[0].classList.contains(classes.revealed)).toBe(true);
    });

    it("should reveal color when a tile is clicked", () => {
      const tile = tiles[0];
      tile.click();
      expect(tile.classList.contains(classes.revealed)).toBe(true);
    });
  });

  describe("handleClick function", () => {
    it("should match two tiles with the same color", () => {
      tiles[0].style.background = "green";
      tiles[1].style.background = "green";
      tiles[0].click();
      tiles[1].click();
      jasmine.clock().tick(1000);

      expect(tiles[0].classList.contains(classes.match)).toBe(true);
      expect(tiles[1].classList.contains(classes.match)).toBe(true);
      expect(tiles[0].classList.contains(classes.revealed)).toBe(false);
      expect(tiles[1].classList.contains(classes.revealed)).toBe(false);
    });

    it("should mismatch two tiles with different colors", () => {
      tiles[3].style.background = "pink";
      tiles[2].style.background = "purple";
      tiles[3].click();
      tiles[2].click();
      jasmine.clock().tick(1001);
      expect(tiles[3].classList.contains(classes.match)).toBe(false);
      expect(tiles[2].classList.contains(classes.match)).toBe(false);
      expect(tiles[3].classList.contains(classes.revealed)).toBe(false);
      expect(tiles[2].classList.contains(classes.revealed)).toBe(false);
    });

    it("should increase turn count on every tile clicked", () => {
      tiles[0].style.background = "green";
      tiles[1].style.background = "green";
      tiles[2].style.background = "pink";
      tiles[3].style.background = "pink";

      tiles[0].click();
      tiles[1].click();
      jasmine.clock().tick(1000);
      expect(domElements.turnCounterElement.textContent).toBe("Turn Count: 2");

      tiles[2].click();
      tiles[3].click();
      jasmine.clock().tick(1000);
      expect(domElements.turnCounterElement.textContent).toBe("Turn Count: 4");
    });
  });

  describe("restartGameState function", () => {
    it("should display congratulations text when all tiles are matched", () => {
      let remainingColors = [
        "red",
        "orange",
        "purple",
        "brown",
        "green",
        "pink",
      ];

      for (let i = 0; i < tiles.length - 1; i += 2) {
        const color = remainingColors.pop();
        tiles[i].style.background = color;
        tiles[i + 1].style.background = color;
        tiles[i].click();
        tiles[i + 1].click();
        jasmine.clock().tick(1000);
      }

      tiles[10].style.background = "orange";
      tiles[11].style.background = "orange";
      tiles[10].click();
      tiles[11].click();
      jasmine.clock().tick(2000);
      expect(domElements.feedback.style.visibility).toBe(classes.visible);
    });

    it("should display restart button after the tile has been clicked", function () {
      tiles[0].style.background = "green";
      tiles[0].click();
      jasmine.clock().tick(1000);
      expect(domElements.restartButton.style.visibility).toBe(classes.visible);
    });

    it("should hide restart button after it was clicked and display no timer.", function () {
      domElements.restartButton.style.visibility = classes.visible;
      domElements.timeElement.textContent = "Time: 1 min 30 sec";

      domElements.restartButton.click();
      jasmine.clock().tick(1000);

      expect(domElements.restartButton.style.visibility).toBe(classes.hidden);
      expect(domElements.timeElement.textContent).toBe(" ");
    });

    it("should reset game to its initial state after reset button is clicked", function () {
      domElements.restartButton.style.visibility = classes.hidden;
      tiles[0].style.background = "red";
      tiles[1].style.background = "red";
      tiles[0].click();
      tiles[1].click();

      jasmine.clock().tick(1000);
      expect(tiles[0].classList).toContain(classes.match);
      expect(tiles[1].classList).toContain(classes.match);

      domElements.restartButton.click();

      expect(tiles[0].classList.contains(attributes.tile));
      expect(tiles[1].classList.contains(attributes.tile));
    });
  });

  describe("Timer functionality", () => {
    it("should display how long it took to complete the game in the success message", () => {
      let remainingColors = [
        "red",
        "orange",
        "purple",
        "brown",
        "green",
        "pink",
      ];

      for (let i = 0; i < tiles.length - 1; i += 2) {
        const color = remainingColors.pop();
        tiles[i].style.background = color;
        tiles[i + 1].style.background = color;
        tiles[i].click();
        tiles[i + 1].click();
        jasmine.clock().tick(1000);
      }

      expect(domElements.feedback.textContent).toEqual(
        messages.congratulationsMessage
      );
    });

    it("should display error message for 3x3 grid", () => {
      const errorMessage = messages.alertMessage;
      let displayedErrorMessage = document.querySelector(".error-message");
      expect(displayedErrorMessage).toBeNull();

      domElements.rowInput.value = "3";
      domElements.columnInput.value = "3";

      domElements.startGameElement.click();
      displayedErrorMessage = document.querySelector(".error-message");

      expect(displayedErrorMessage.textContent).toBe(errorMessage);
    });

    it("should update the timer every second", () => {
      tiles[3].style.background = "pink";
      tiles[2].style.background = "purple";
      tiles[3].click();
      tiles[2].click();
      jasmine.clock().tick(1000);
      const initialTime = domElements.timeElement.textContent;
      jasmine.clock().tick(3000);
      const updatedTime = domElements.timeElement.textContent;
      expect(updatedTime).not.toBe(initialTime);
    });
  });
});
