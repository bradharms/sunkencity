// @ts-check
const path = require('path');
const os = require('os');

const DLM = path.delimiter;
const E = module.exports;

E.ROOT_DIR = path.resolve(__dirname);
E.SRC_DIR = path.resolve(E.ROOT_DIR, 'c');
E.BUILD_DIR = path.resolve(E.ROOT_DIR, 'build');
