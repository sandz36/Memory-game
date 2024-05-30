const { messages, events, gameControllers } = require("./helper_objects");
const { resetGameState, shuffleTiles, handleClick } = require("./helper_functions");

const domElements = require("./dom_elements");

function startGame() {
  const rows = parseInt(domElements.rowInput.value);
  const columns = parseInt(domElements.columnInput.value);
  if (rows * columns === 9) {
    displayErrorMessage(messages.alertMessage);
    return;
  }
  shuffleTiles(rows, columns);
  gameControllers.isFirstClick = true;
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

domElements.startGameElement.addEventListener(events.click, (event) => {
  event.preventDefault();
  resetGameState();
  startGame();
});

module.exports = {
  handleClick,
  shuffleTiles,
  startGame,
};
