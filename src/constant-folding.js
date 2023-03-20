// See https://github.com/babel/minify/tree/master/packages/babel-plugin-minify-constant-folding
const fs = require("fs");
const deb = require('../src/deb.js');
const escodegen = require("escodegen");
const espree = require("espree");
const estraverse = require("estraverse");

"use strict";

module.exports = constantFolding;

/**
 * A function that blah
 * @param {string} code A string blah
 * blah document
 * @returns {string} Returns blah
 */
function constantFolding(code, pattern) {
  /* ... */
}

