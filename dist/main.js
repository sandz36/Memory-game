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

/***/ "./src/dom_helpers.js":
/*!****************************!*\
  !*** ./src/dom_helpers.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { selectors, classes } = __webpack_require__(/*! ./dom_strings */ \"./src/dom_strings.js\");\n\nfunction isTileRevealedOrMatched(tile) {\n  if (\n    tile.classList.contains(classes.revealed) ||\n    tile.classList.contains(classes.match)\n  ) {\n    return true;\n  }\n  return false;\n}\n\nfunction addRevealClassPush(tile) {\n  const numberOfRevealedTiles = getRevealedTiles().length;\n\n  if (numberOfRevealedTiles < 2) {\n    tile.classList.add(classes.revealed);\n  }\n}\n\nfunction addMatchClass(tile1, tile2) {\n  tile1.classList.add(classes.match);\n  tile2.classList.add(classes.match);\n}\n\nfunction checkAllTilesFlippedAndCounter(counter, tiles) {\n  const tileArray = [...tiles];\n  const allFlipped = tileArray.every((tile) =>\n    tile.classList.contains(classes.match)\n  );\n\n  return allFlipped || counter === 0;\n}\nfunction handleMismatchedTiles(tile1, tile2) {\n  tile1.classList.remove(classes.revealed);\n  tile2.classList.remove(classes.revealed);\n}\n\nfunction getRevealedTiles() {\n  const tiles = document.querySelectorAll(selectors.tiles);\n\n  return [...tiles].filter(\n    (tile) =>\n      tile.classList.contains(classes.revealed) &&\n      !tile.classList.contains(classes.matched)\n  );\n}\n\nmodule.exports = {\n  isTileRevealedOrMatched,\n  addRevealClassPush,\n  addMatchClass,\n  checkAllTilesFlippedAndCounter,\n  handleMismatchedTiles,\n  getRevealedTiles,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/dom_helpers.js?");

/***/ }),

/***/ "./src/dom_strings.js":
/*!****************************!*\
  !*** ./src/dom_strings.js ***!
  \****************************/
/***/ ((module) => {

eval("const selectors = {\n  tilesContainer: \".tiles\",\n  tiles: \".tile\",\n  restart: \".restart\",\n  feedback: \".feedback\",\n  start: \"startGame\",\n  row: \"rows\",\n  column: \"columns\",\n  timeElement: \"timer\",\n  turnCount: \"turnCounter\",\n};\n\nconst messages = {\n  alertMessage:\n    \"Total number of tiles cannot be 9. Please choose different dimensions.\",\n  congratulationsMessage:\n    \"Congratulations! You've completed the game in 12 moves and 0 minutes and 6 seconds!\",\n  getTurnCountString: (turnCount) => `Turn Count: ${turnCount}`,\n};\n\nconst attributes = {\n  div: \"div\",\n  tile: \"tile\",\n  colorData: \"data-color\",\n  id: \"id\",\n};\n\nconst classes = {\n  revealed: \"revealed\",\n  match: \"match\",\n  visible: \"visible\",\n  hidden: \"hidden\",\n};\n\nconst colorsArray = [\n  \"red\",\n  \"orange\",\n  \"purple\",\n  \"brown\",\n  \"green\",\n  \"pink\",\n  \"yellow\",\n  \"white\",\n];\n\nconst events = {\n  click: \"click\",\n};\n\nconst gameControllers = {\n  turnCount: 0,\n  startTime: null,\n  timerInterval: null,\n  elapsedTime: null,\n  isFirstClick: true,\n  isAwaitingMove: false,\n};\n\n\nmodule.exports = {\n  selectors,\n  messages,\n  attributes,\n  classes,\n  colorsArray,\n  events,\n  gameControllers,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/dom_strings.js?");

/***/ }),

/***/ "./src/memory_game.js":
/*!****************************!*\
  !*** ./src/memory_game.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  selectors,\n  messages,\n  attributes,\n  classes,\n  colorsArray,\n  events,\n  gameControllers,\n} = __webpack_require__(/*! ./dom_strings */ \"./src/dom_strings.js\");\nconst {\n  isTileRevealedOrMatched,\n  addRevealClassPush,\n  addMatchClass,\n  checkAllTilesFlippedAndCounter,\n  handleMismatchedTiles,\n  getRevealedTiles,\n} = __webpack_require__(/*! ./dom_helpers */ \"./src/dom_helpers.js\");\n\n//  gameControllers.turnCount;\nlet startTime;\nlet timerInterval;\nlet elapsedTime;\nlet isFirstClick = true;\nlet isAwaitingMove = false;\n\nfunction buildTile(color, id) {\n  const element = document.createElement(attributes.div);\n  element.classList.add(attributes.tile);\n  element.setAttribute(attributes.colorData, color);\n  element.setAttribute(attributes.id, id);\n  element.style.background = color;\n  return element;\n}\n\nfunction shuffleTiles(rows, columns) {\n  const tilesContainer = setGridSize(rows, columns);\n  const total = rows * columns;\n  const colors = colorsArray.slice(0, total / 2);\n  const colorsPickList = [...colors, ...colors];\n  const tileCount = colorsPickList.length;\n  for (let i = 0; i < tileCount; i++) {\n    const randomIndex = Math.floor(Math.random() * colorsPickList.length);\n    const color = colorsPickList[randomIndex];\n    const tile = buildTile(color, i);\n    tile.addEventListener(events.click, handleClick);\n    colorsPickList.splice(randomIndex, 1);\n    tilesContainer.appendChild(tile);\n  }\n}\n\nfunction setGridSize(rows, columns) {\n  const tilesContainer = document.querySelector(selectors.tilesContainer);\n\n  const heights = {\n    2: \"175px\",\n    3: \"265px\",\n    4: \"350px\",\n  };\n\n  const widths = {\n    2: \"180px\",\n    3: \"270px\",\n    4: \"345px\",\n  };\n\n  const height = heights[rows] || \"auto\";\n  const width = widths[columns] || \"auto\";\n\n  tilesContainer.style.width = width;\n  tilesContainer.style.height = height;\n  return tilesContainer;\n}\n\nfunction startGame() {\n  const rows = parseInt(document.getElementById(selectors.row).value);\n  const columns = parseInt(document.getElementById(selectors.column).value);\n  if (rows * columns === 9) {\n    displayErrorMessage(messages.alertMessage);\n    return;\n  }\n  shuffleTiles(rows, columns);\n  isFirstClick = true;\n}\n\nfunction displayErrorMessage(message) {\n  const errorMessage = document.createElement(\"div\");\n  errorMessage.classList.add(\"error-message\");\n  errorMessage.textContent = message;\n  document.body.appendChild(errorMessage);\n\n  setTimeout(() => {\n    errorMessage.remove();\n  }, 3000);\n}\n\nfunction startTimer() {\n  startTime = new Date();\n  timerInterval = setInterval(updateTimer, 1000);\n}\n\nfunction stopTimer() {\n  clearInterval(timerInterval);\n}\n\nfunction updateTimer() {\n  const currentTime = new Date();\n  elapsedTime = new Date(currentTime - startTime);\n  const minutes = elapsedTime.getMinutes();\n  const seconds = elapsedTime.getSeconds();\n  document.getElementById(\n    selectors.timeElement\n  ).textContent = `Time: ${minutes} min ${seconds} sec`;\n}\n\nlet startGameElement = document.getElementById(selectors.start);\nstartGameElement.addEventListener(events.click, function (event) {\n  event.preventDefault();\n  resetGameState();\n  startGame();\n});\n\nlet restartButton = document.querySelector(selectors.restart);\nrestartButton.addEventListener(events.click, () => {\n  resetGameState();\n  isFirstClick = true;\n  const rows = parseInt(document.getElementById(selectors.row).value);\n  const columns = parseInt(document.getElementById(selectors.column).value);\n  shuffleTiles(rows, columns);\n});\n\nfunction handleClick(event) {\n  const tiles = document.querySelectorAll(selectors.tiles);\n  let counter = tiles.length;\n  const tile = event.target;\n  if (isAwaitingMove) {\n    return;\n  }\n  if (isTileRevealedOrMatched(tile)) {\n    return;\n  }\n\n  addRevealClassPush(tile);\n  const revealedTiles = getRevealedTiles();\n  gameControllers.turnCount++;\n\n  if (revealedTiles.length === 2) {\n    const turnCounterElement = document.getElementById(selectors.turnCount);\n    if (turnCounterElement) {\n      turnCounterElement.textContent = messages.getTurnCountString(gameControllers.turnCount);\n    }\n\n    const feedback = document.querySelector(selectors.feedback);\n    const tile1 = document.getElementById(revealedTiles[0].id);\n    const tile2 = document.getElementById(revealedTiles[1].id);\n    if (tile1.style.backgroundColor === tile2.style.backgroundColor) {\n      counter -= 2;\n      isAwaitingMove = true;\n      setTimeout(() => {\n        addMatchClass(tile1, tile2);\n        tile1.classList.remove(classes.revealed);\n        tile2.classList.remove(classes.revealed);\n\n        if (checkAllTilesFlippedAndCounter(counter, tiles)) {\n          feedback.textContent = `Congratulations! You've completed the game in ${gameControllers.turnCount} moves and ${elapsedTime.getMinutes()} minutes and ${elapsedTime.getSeconds()} seconds!`;\n          feedback.style.visibility = classes.visible;\n          stopTimer();\n        }\n        isAwaitingMove = false;\n      }, 1000);\n    } else {\n      isAwaitingMove = true;\n      setTimeout(() => {\n        handleMismatchedTiles(tile1, tile2);\n        isAwaitingMove = false;\n      }, 1000);\n    }\n  }\n\n  if (isFirstClick) {\n    startTimer();\n    restartButton.style.visibility = classes.visible;\n    isFirstClick = false;\n  }\n  return gameControllers.turnCount;\n}\n\nfunction resetGameState() {\n  const feedback = document.querySelector(selectors.feedback);\n  let restartButton = document.querySelector(selectors.restart);\n  const tilesContainer = document.querySelector(selectors.tilesContainer);\n\n  let tiles = document.querySelectorAll(selectors.tiles);\n  tilesContainer.innerHTML = \"\";\n  restartButton.style.visibility = classes.hidden;\n  counter = tiles.length;\n  feedback.style.visibility = classes.hidden;\n  stopTimer();\n  isFirstClick = true;\n  document.getElementById(selectors.timeElement).textContent = \" \";\n  gameControllers.turnCount = 0;\n  const turnCounterElement = document.getElementById(selectors.turnCount);\n  if (turnCounterElement) {\n    turnCounterElement.textContent = messages.getTurnCountString(gameControllers.turnCount);\n  }\n}\n\nmodule.exports = {\n  handleClick,\n  shuffleTiles,\n  startGame,\n  startGameElement,\n  restartButton,\n  resetGameState,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

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