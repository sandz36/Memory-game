const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

function setupJSDOM() {
  const index = fs.readFileSync(path.join(__dirname, "../index.html"));
  const bundle = fs.readFileSync(
    path.join(__dirname, "../dist/main.js"),
    "utf-8"
  );

  const { document } = new JSDOM(index, {
    runScripts: "dangerously",
    resources: "usable",
  }).window;

  global.document = document;

  const script = document.createElement("script");
  script.textContent = bundle;
  document.head.appendChild(script);
}

module.exports = { setupJSDOM };
