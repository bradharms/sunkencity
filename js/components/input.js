// @ts-check

import * as app from '../app.js';
import * as geom from '../geom.js';

/**
 * @typedef {Object} Directions
 * @property {boolean} left
 * @property {boolean} right
 * @property {boolean} up
 * @property {boolean} down
 */

/**
 * @typedef {Object} InputEngineData
 * @property {Directions} inputDirs
 * @property {geom.Point} inputPos
 */

export const K_LEFT = 'a';
export const K_RIGHT = 'd';
export const K_UP = 'w';
export const K_DOWN = 's';

export const COS_45 = Math.cos(Math.PI / 4);
export const SIN_45 = Math.sin(Math.PI / 4);

/**
 * @type {app.Engine}
 */
export const engine = {
    /**
     * @param {InputEngineData} data
     */
    async  onRegister(data) {
        data.inputDirs = {
            left: false,
            right: false,
            up: false,
            down: false,
        };
        data.inputPos = { x: 0, y: 0 };
    },

    /**
     * @param {InputEngineData} data
     */
    onStart(data) {
        /**
         * @param {KeyboardEvent} e
         */
        const runKeyboard = (e) => {
            handleKeyboardEvent(e, data);
        }
        window.addEventListener('keydown', runKeyboard);
        window.addEventListener('keyup', runKeyboard);
        return;
    },
};

/**
 * 
 * @param {KeyboardEvent} e 
 * @param {InputEngineData} data
 */
function handleKeyboardEvent(e, data) {
    const active = e.type === 'keydown';
    switch (e.key) {
        case K_LEFT:
            data.inputDirs.left = active;
            break;

        case K_RIGHT:
            data.inputDirs.right = active;
            break;
            
        case K_UP:
            data.inputDirs.up = active;
            break;

        case K_DOWN:
            data.inputDirs.down = active;
            break;
    }

    directionToPoint(data.inputDirs, data.inputPos);
}

/**
 * @param {Directions} dir 
 * @param {geom.Point} pos 
 */
export function directionToPoint(dir, pos) {
    const h = (dir.left == dir.right) ? 0 : (dir.left) ? -1 : 1;
    const v = (dir.up == dir.down) ? 0 : (dir.up) ? -1 : 1;
    pos.x = h * ((h && v) ? COS_45 : 1);
    pos.y = v * ((h && v) ? SIN_45 : 1);
}