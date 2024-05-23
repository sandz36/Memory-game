/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dom_elements.js":
/*!*****************************!*\
  !*** ./src/dom_elements.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { selectors } = __webpack_require__(/*! ./dom_strings */ \"./src/dom_strings.js\");\n\nconst domElements = {\n  tilesContainer: document.querySelector(selectors.tilesContainer),\n  restartButton: document.querySelector(selectors.restart),\n  feedback: document.querySelector(selectors.feedback),\n  startGameElement: document.getElementById(selectors.start),\n  turnCounterElement: document.getElementById(selectors.turnCount),\n  timeElement: document.getElementById(selectors.timeElement),\n  rowInput: document.getElementById(selectors.row),\n  columnInput: document.getElementById(selectors.column),\n  getTiles: () => document.querySelectorAll(selectors.tiles),\n  getTileById: (id) => document.getElementById(id),\n};\n\nmodule.exports = domElements;\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/dom_elements.js?");

/***/ }),

/***/ "./src/dom_helpers.js":
/*!****************************!*\
  !*** ./src/dom_helpers.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  selectors,\n  messages,\n  classes,\n  gameControllers,\n  events,\n  gridDimensions,\n  colorsArray,\n  attributes,\n} = __webpack_require__(/*! ./dom_strings */ \"./src/dom_strings.js\");\nconst domElements = __webpack_require__(/*! ./dom_elements */ \"./src/dom_elements.js\");\n\nfunction updateTurnCountDisplay() {\n  if (domElements.turnCounterElement) {\n    domElements.turnCounterElement.textContent = messages.getTurnCountString(gameControllers.turnCount);\n  }\n}\n\nfunction handleRevealedTiles(tile1, tile2, counter, tiles, feedback) {\n  if (tile1.style.backgroundColor === tile2.style.backgroundColor) {\n    handleMatch(tile1, tile2, counter, tiles, feedback);\n  } else {\n    handleMismatch(tile1, tile2);\n  }\n}\n\nfunction handleMatch(tile1, tile2, counter, tiles, feedback) {\n  counter -= 2;\n  gameControllers.isAwaitingMove = true;\n  setTimeout(() => {\n    addMatchClass(tile1, tile2);\n    tile1.classList.remove(classes.revealed);\n    tile2.classList.remove(classes.revealed);\n\n    if (checkAllTilesFlippedAndCounter(counter, tiles)) {\n      feedback.textContent = `Congratulations! You've completed the game in ${gameControllers.turnCount} moves and ${gameControllers.elapsedTime.getMinutes()} minutes and ${gameControllers.elapsedTime.getSeconds()} seconds!`;\n      feedback.style.visibility = classes.visible;\n      stopTimer();\n    }\n    gameControllers.isAwaitingMove = false;\n  }, 1000);\n}\n\nfunction handleMismatch(tile1, tile2) {\n  gameControllers.isAwaitingMove = true;\n  setTimeout(() => {\n    handleMismatchedTiles(tile1, tile2);\n    gameControllers.isAwaitingMove = false;\n  }, 1000);\n}\n\nfunction updateTimer() {\n  const currentTime = new Date();\n  gameControllers.elapsedTime = new Date(currentTime - gameControllers.startTime);\n  const minutes = gameControllers.elapsedTime.getMinutes();\n  const seconds = gameControllers.elapsedTime.getSeconds();\n  domElements.timeElement.textContent = `Time: ${minutes} min ${seconds} sec`;\n}\n\nfunction startTimer() {\n  gameControllers.startTime = new Date();\n  gameControllers.timerInterval = setInterval(updateTimer, 1000);\n}\n\nfunction stopTimer() {\n  clearInterval(gameControllers.timerInterval);\n}\n\nfunction resetGameState() {\n  domElements.tilesContainer.innerHTML = \"\";\n  domElements.restartButton.style.visibility = classes.hidden;\n  domElements.feedback.style.visibility = classes.hidden;\n  stopTimer();\n  gameControllers.isFirstClick = true;\n  domElements.timeElement.textContent = \" \";\n  gameControllers.turnCount = 0;\n  updateTurnCountDisplay();\n}\n\nfunction handleClick(event) {\n  const tiles = domElements.getTiles();\n  let counter = tiles.length;\n  const tile = event.target;\n  if (gameControllers.isAwaitingMove || isTileRevealedOrMatched(tile)) return;\n\n  addRevealClassPush(tile);\n  const revealedTiles = getRevealedTiles();\n  gameControllers.turnCount++;\n\n  if (revealedTiles.length === 2) {\n    updateTurnCountDisplay();\n    const tile1 = domElements.getTileById(revealedTiles[0].id);\n    const tile2 = domElements.getTileById(revealedTiles[1].id);\n    handleRevealedTiles(tile1, tile2, counter, tiles, domElements.feedback);\n  }\n\n  if (gameControllers.isFirstClick) {\n    startTimerOnFirstClick();\n  }\n}\n\nfunction setGridSize(rows, columns) {\n  const height = gridDimensions.heights[rows] || \"auto\";\n  const width = gridDimensions.widths[columns] || \"auto\";\n  domElements.tilesContainer.style.width = width;\n  domElements.tilesContainer.style.height = height;\n  return domElements.tilesContainer;\n}\n\nfunction buildTile(color, id) {\n  const element = document.createElement(attributes.div);\n  element.classList.add(attributes.tile);\n  element.setAttribute(attributes.colorData, color);\n  element.setAttribute(attributes.id, id);\n  element.style.background = color;\n  return element;\n}\n\nfunction shuffleTiles(rows, columns) {\n  const tilesContainer = setGridSize(rows, columns);\n  const total = rows * columns;\n  const colors = colorsArray.slice(0, total / 2);\n  const colorsPickList = [...colors, ...colors];\n  const tileCount = colorsPickList.length;\n  for (let i = 0; i < tileCount; i++) {\n    const randomIndex = Math.floor(Math.random() * colorsPickList.length);\n    const color = colorsPickList[randomIndex];\n    const tile = buildTile(color, i);\n    tile.addEventListener(events.click, handleClick);\n    colorsPickList.splice(randomIndex, 1);\n    tilesContainer.appendChild(tile);\n  }\n}\n\ndomElements.restartButton.addEventListener(events.click, () => {\n  resetGameState();\n  const rows = parseInt(domElements.rowInput.value);\n  const columns = parseInt(domElements.columnInput.value);\n  shuffleTiles(rows, columns);\n});\n\nfunction startTimerOnFirstClick() {\n  startTimer();\n  domElements.restartButton.style.visibility = classes.visible;\n  gameControllers.isFirstClick = false;\n}\n\nfunction isTileRevealedOrMatched(tile) {\n  return tile.classList.contains(classes.revealed) || tile.classList.contains(classes.match);\n}\n\nfunction addRevealClassPush(tile) {\n  if (getRevealedTiles().length < 2) {\n    tile.classList.add(classes.revealed);\n  }\n}\n\nfunction addMatchClass(tile1, tile2) {\n  tile1.classList.add(classes.match);\n  tile2.classList.add(classes.match);\n}\n\nfunction checkAllTilesFlippedAndCounter(counter, tiles) {\n  return [...tiles].every(tile => tile.classList.contains(classes.match)) || counter === 0;\n}\n\nfunction handleMismatchedTiles(tile1, tile2) {\n  tile1.classList.remove(classes.revealed);\n  tile2.classList.remove(classes.revealed);\n}\n\nfunction getRevealedTiles() {\n  return [...domElements.getTiles()].filter(tile => tile.classList.contains(classes.revealed) && !tile.classList.contains(classes.matched));\n}\n\nmodule.exports = {\n  isTileRevealedOrMatched,\n  addRevealClassPush,\n  addMatchClass,\n  checkAllTilesFlippedAndCounter,\n  handleMismatchedTiles,\n  getRevealedTiles,\n  updateTurnCountDisplay,\n  handleRevealedTiles,\n  handleMatch,\n  handleMismatch,\n  startTimerOnFirstClick,\n  resetGameState,\n  shuffleTiles,\n  setGridSize,\n  buildTile,\n  handleClick,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/dom_helpers.js?");

/***/ }),

/***/ "./src/dom_strings.js":
/*!****************************!*\
  !*** ./src/dom_strings.js ***!
  \****************************/
/***/ ((module) => {

eval("const selectors = {\n  tilesContainer: \".tiles\",\n  tiles: \".tile\",\n  restart: \".restart\",\n  feedback: \".feedback\",\n  start: \"startGame\",\n  row: \"rows\",\n  column: \"columns\",\n  timeElement: \"timer\",\n  turnCount: \"turnCounter\",\n};\n\nconst messages = {\n  alertMessage:\n    \"Total number of tiles cannot be 9. Please choose different dimensions.\",\n  congratulationsMessage:\n    \"Congratulations! You've completed the game in 12 moves and 0 minutes and 6 seconds!\",\n  getTurnCountString: (turnCount) => `Turn Count: ${turnCount}`,\n};\n\nconst attributes = {\n  div: \"div\",\n  tile: \"tile\",\n  colorData: \"data-color\",\n  id: \"id\",\n};\n\nconst classes = {\n  revealed: \"revealed\",\n  match: \"match\",\n  visible: \"visible\",\n  hidden: \"hidden\",\n};\n\nconst colorsArray = [\n  \"red\",\n  \"orange\",\n  \"purple\",\n  \"brown\",\n  \"green\",\n  \"pink\",\n  \"yellow\",\n  \"white\",\n];\n\nconst events = {\n  click: \"click\",\n};\n\nconst gameControllers = {\n  turnCount: 0,\n  startTime: null,\n  timerInterval: null,\n  elapsedTime: null,\n  isFirstClick: true,\n  isAwaitingMove: false,\n};\n\nconst gridDimensions = {\n   heights :  {\n    2: \"175px\",\n    3: \"265px\",\n    4: \"350px\",\n  },\n\n   widths : {\n    2: \"180px\",\n    3: \"270px\",\n    4: \"345px\",\n  }\n}\n\n\nmodule.exports = {\n  selectors,\n  messages,\n  attributes,\n  classes,\n  colorsArray,\n  events,\n  gameControllers,\n  gridDimensions,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/dom_strings.js?");

/***/ }),

/***/ "./src/memory_game.js":
/*!****************************!*\
  !*** ./src/memory_game.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { messages, events, gameControllers } = __webpack_require__(/*! ./dom_strings */ \"./src/dom_strings.js\");\nconst { resetGameState, shuffleTiles, handleClick } = __webpack_require__(/*! ./dom_helpers */ \"./src/dom_helpers.js\");\n\nconst domElements = __webpack_require__(/*! ./dom_elements */ \"./src/dom_elements.js\");\n\nfunction startGame() {\n  const rows = parseInt(domElements.rowInput.value);\n  const columns = parseInt(domElements.columnInput.value);\n  if (rows * columns === 9) {\n    displayErrorMessage(messages.alertMessage);\n    return;\n  }\n  shuffleTiles(rows, columns);\n  gameControllers.isFirstClick = true;\n}\n\nfunction displayErrorMessage(message) {\n  const errorMessage = document.createElement(\"div\");\n  errorMessage.classList.add(\"error-message\");\n  errorMessage.textContent = message;\n  document.body.appendChild(errorMessage);\n\n  setTimeout(() => {\n    errorMessage.remove();\n  }, 3000);\n}\n\ndomElements.startGameElement.addEventListener(events.click, (event) => {\n  event.preventDefault();\n  resetGameState();\n  startGame();\n});\n\nmodule.exports = {\n  handleClick,\n  shuffleTiles,\n  startGame,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/memory_game.js");
/******/ 	
/******/ })()
;