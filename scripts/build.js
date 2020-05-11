#!/usr/bin/env node
// @ts-check
const path = require('path');
const sh = require('shelljs');

function main() {
    cc('main.c', 'index.html');
}

/**
 * @param {string} filename
 */
const srcDir = (filename) => path.resolve(process.env.SRC_DIR, filename);
/**
 * @param {string} filename
 */
const buildDir = (filename) => path.resolve(process.env.BUILD_DIR, filename);
/**
 * @param {string} fileIn
 * @param {string} fileOut
 */
const cc = (fileIn, fileOut) =>
    sh.exec(`emcc ${srcDir(fileIn)} -o ${buildDir(fileOut)}`);

main();
