/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 */
export function addPoints(a, b, c) {
    c.x = a.x + b.x;
    c.y = a.y + b.y;
}
