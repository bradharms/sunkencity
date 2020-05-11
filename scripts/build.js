#!/usr/bin/env node
// @ts-check
const path = require('path');
const sh = require('shelljs');
const glob = require('glob');

function main() {
    sh.test('-d', process.env.BUILD_DIR) || sh.mkdir(process.env.BUILD_DIR);
    cc(glob.sync(srcDir('**/*.c')).join(' '), buildDir('index.html'));
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
    sh.exec(`emcc ${fileIn} -o ${fileOut}`);

main();
