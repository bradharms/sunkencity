// @ts-check

import * as render from '../engines/render.js';

/**
 * @typedef {Object} BackgroundActorData
 * @property {(
 *  render.RenderEngineData
 * )} engineData 
 */

/**
 * 
 * @param {BackgroundActorData} actorData 
 */
export function handleRenderBeforeActors(actorData) {
    const ctx = actorData.engineData.ctx;
    const canvas = actorData.engineData.canvas;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
}