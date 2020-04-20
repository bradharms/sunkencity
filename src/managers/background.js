// @ts-check

import * as render from '../engines/render.js';

/**
 * @typedef {Object} BackgroundManagerData
 * @property {(
 *  render.RenderEngineData
 * )} engineData 
 */

/**
 * 
 * @param {BackgroundManagerData} managerData 
 */
export function handleRenderBeforeActors(managerData) {
    const ctx = managerData.engineData.ctx;
    const canvas = managerData.engineData.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}