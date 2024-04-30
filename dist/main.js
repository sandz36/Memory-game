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
/***/ ((module) => {

eval("function isTileRevealedOrMatched(tile) {\n  if (\n    tile.classList.contains(strings.revealed) ||\n    tile.classList.contains(strings.match)\n  ) {\n    return true;\n  }\n  return false;\n}\n\nfunction addRevealClassPush(tile) {\n  const numberOfRevealedTiles = getRevealedTiles().length;\n\n  if (numberOfRevealedTiles < 2) {\n    tile.classList.add(strings.revealed);\n  }\n}\n\nfunction addMatchClass(tile1, tile2) {\n  tile1.classList.add(strings.match);\n  tile2.classList.add(strings.match);\n}\n\nfunction checkAllTilesFlippedAndCounter(counter, tiles) {\n  const tileArray = [...tiles];\n  let allFlipped = tileArray.every((tile) =>\n    tile.classList.contains(strings.match)\n  );\n\n  return allFlipped || counter === 0;\n}\nfunction handleMismatchedTiles(tile1, tile2) {\n  tile1.classList.remove(strings.revealed);\n  tile2.classList.remove(strings.revealed);\n}\n\nfunction getRevealedTiles() {\n  const tiles = document.querySelectorAll(strings.tiles);\n\n  return [...tiles].filter(\n    (tile) =>\n      tile.classList.contains(strings.revealed) &&\n      !tile.classList.contains(strings.matched)\n  );\n}\n\nmodule.exports = {\n  isTileRevealedOrMatched,\n  addRevealClassPush,\n  addMatchClass,\n  checkAllTilesFlippedAndCounter,\n  handleMismatchedTiles,\n  getRevealedTiles,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/dom_helpers.js?");

/***/ }),

/***/ "./src/dom_strings.js":
/*!****************************!*\
  !*** ./src/dom_strings.js ***!
  \****************************/
/***/ ((module) => {

eval("strings = {\n  tilesContainer: \".tiles\",\n  tiles: \".tile\",\n  restart: \".restart\",\n  feedback: \".feedback\",\n  colors: [\n    \"red\",\n    \"orange\",\n    \"purple\",\n    \"brown\",\n    \"green\",\n    \"pink\",\n    \"yellow\",\n    \"white\",\n  ],\n  div: \"div\",\n  tile: \"tile\",\n  colorData: \"data-color\",\n  click: \"click\",\n  revealed: \"revealed\",\n  match: \"match\",\n  id: \"id\",\n  visible: \"visible\",\n  hidden: \"hidden\",\n  start: \"startGame\",\n  row: \"rows\",\n  column: \"columns\",\n};\n\nmodule.exports = strings;\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/dom_strings.js?");

/***/ }),

/***/ "./src/memory_game.js":
/*!****************************!*\
  !*** ./src/memory_game.js ***!
  \****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const strings = __webpack_require__(/*! ./dom_strings */ \"./src/dom_strings.js\");\nconst {\n  isTileRevealedOrMatched,\n  addRevealClassPush,\n  addMatchClass,\n  checkAllTilesFlippedAndCounter,\n  handleMismatchedTiles,\n  getRevealedTiles,\n} = __webpack_require__(/*! ./dom_helpers */ \"./src/dom_helpers.js\");\n\nfunction buildTile(color, id) {\n  const element = document.createElement(strings.div);\n  element.classList.add(strings.tile);\n  element.setAttribute(strings.colorData, color);\n  element.setAttribute(strings.id, id);\n  element.style.background = color;\n  return element;\n}\n\nfunction shuffleTiles(rows, columns) {\n  const tilesContainer = setGridSize(rows, columns);\n  const total = rows * columns;\n  const colors = strings.colors.slice(0, total / 2);\n  const colorsPickList = [...colors, ...colors];\n  const tileCount = colorsPickList.length;\n  for (let i = 0; i < tileCount; i++) {\n    const randomIndex = Math.floor(Math.random() * colorsPickList.length);\n    const color = colorsPickList[randomIndex];\n    const tile = buildTile(color, i);\n    tile.addEventListener(strings.click, handleClick);\n    colorsPickList.splice(randomIndex, 1);\n    tilesContainer.appendChild(tile);\n  }\n}\n\nfunction setGridSize(rows, columns) {\n  const tilesContainer = document.querySelector(strings.tilesContainer);\n\n  const heights = {\n    2: \"180px\",\n    3: \"260px\",\n    4: \"300px\",\n  };\n\n  const widths = {\n    2: \"190px\",\n    3: \"260px\",\n    4: \"300px\",\n  };\n\n  const height = heights[rows] || \"auto\";\n  const width = widths[columns] || \"auto\";\n\n  tilesContainer.style.width = width;\n  tilesContainer.style.height = height;\n  return tilesContainer;\n}\n\nfunction startGame() {\n  const rows = parseInt(document.getElementById(strings.row).value);\n  const columns = parseInt(document.getElementById(strings.column).value);\n  shuffleTiles(rows, columns);\n}\n\nlet startGameElement = document.getElementById(strings.start);\nstartGameElement.addEventListener(strings.click, function (event) {\n  event.preventDefault();\n  resetGameState();\n  startGame();\n});\n\nlet restartButton = document.querySelector(strings.restart);\nrestartButton.addEventListener(strings.click, () => {\n  resetGameState();\n  const rows = parseInt(document.getElementById(strings.row).value);\n  const columns = parseInt(document.getElementById(strings.column).value);\n  shuffleTiles(rows, columns);\n});\n\nfunction handleClick(event) {\n  const tiles = document.querySelectorAll(strings.tiles);\n  let counter = tiles.length;\n  const total = tiles.length;\n  const tile = event.target;\n  if (isTileRevealedOrMatched(tile)) {\n    return;\n  }\n\n  addRevealClassPush(tile);\n  const revealedTiles = getRevealedTiles();\n\n  if (revealedTiles.length === 2) {\n    const feedback = document.querySelector(strings.feedback);\n    const tile1 = document.getElementById(revealedTiles[0].id);\n    const tile2 = document.getElementById(revealedTiles[1].id);\n\n    if (tile1.style.backgroundColor === tile2.style.backgroundColor) {\n      counter -= 2;\n      setTimeout(() => {\n        addMatchClass(tile1, tile2);\n        tile1.classList.remove(strings.revealed);\n        tile2.classList.remove(strings.revealed);\n\n        if (counter === total - 2) {\n          restartButton.style.visibility = strings.visible;\n        }\n        if (checkAllTilesFlippedAndCounter(counter, tiles)) {\n          feedback.style.visibility = strings.visible;\n        }\n      }, 1000);\n    } else {\n      setTimeout(() => {\n        handleMismatchedTiles(tile1, tile2);\n      }, 1000);\n    }\n  }\n}\n\nfunction resetGameState() {\n  const feedback = document.querySelector(strings.feedback);\n  let restartButton = document.querySelector(strings.restart);\n  const tilesContainer = document.querySelector(strings.tilesContainer);\n\n  let tiles = document.querySelectorAll(strings.tiles);\n  tilesContainer.innerHTML = \"\";\n  restartButton.style.visibility = strings.hidden;\n  counter = tiles.length;\n  feedback.style.visibility = strings.hidden;\n}\n\nmodule.exports = {\n  handleClick,\n  shuffleTiles,\n  startGame,\n  startGameElement,\n  restartButton,\n  resetGameState,\n};\n\n\n//# sourceURL=webpack://sandile-mdluli-222-memory-game-in-vanilla-js-javascript/./src/memory_game.js?");

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