// @ts-check

export const P_0 = { x: 0, y: 0 };
export const P_1 = { x: 1, y: 1 };
export const P_N1 = { x: -1, y: -1 };

/**
 * @typedef {object} Point
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef {Point & {
 *  w: number;
 *  h: number;
 * }} Rect 
 */

/**
 * @param {Readonly<Point>} a
 * @param {Readonly<Point>} b
 * @param {Point} c
 */
export function move(a, b, c) {
    c.x = a.x + b.x;
    c.y = a.y + b.y;
}

/**
 * @param {Readonly<Point>} a
 * @param {Readonly<Point>} b 
 * @param {Point} c 
 */
export function scalePoint(a, b, c) {
    c.x = a.x * b.x;
    c.y = a.y * b.y;
}

/**
 * @param {Readonly<Rect>} a 
 * @param {Readonly<Rect>} b 
 * @param {Rect} c 
 */
export function intersect(a, b, c) {
    const dL = Math.max(a.x, b.x);
    const dT = Math.max(a.y, b.y);
    const dR = Math.min(a.x + a.w, b.x + b.w);
    const dB = Math.min(a.y + b.h, b.y + b.h);

    c.x = dL;
    c.y = dT;
    c.w = dR - dL;
    c.h = dB - dT; 
}

/**
 * @param {Readonly<Rect>} a
 * @param {Readonly<Rect>} b 
 */
export function isIntersecting(a, b) {
    intersect(a, b, tmpRect);
    return tmpRect.w > 0 && tmpRect.h > 0;
}
const tmpRect = {x: 0, y: 0, w: 0, h: 0};

/**
 * @param {Readonly<Rect>} a 
 * @param {Readonly<Rect>} b 
 */
export function isContained(a, b) {
    return (
        (a.x < b.x) &&
        (a.y < b.y) &&
        ((a.x + a.w) > (b.x + b.w)) &&
        ((a.y + a.h) > (b.y + b.h))
    );
}
