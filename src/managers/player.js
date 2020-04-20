// @ts-check

import * as app from '../app.js';
import * as geom from '../geom.js';
import * as render from '../engines/render.js';
import * as factory from '../engines/factory.js';
import * as input from '../engines/input.js';

/**
 * @typedef {Object} PlayerManagerData
 * @property {HTMLImageElement} img
 */

/**
 * @typedef {Object} PlayerActorData
 * @property {(
 *  app.AppData &
 *  render.RenderEngineData &
 *  factory.FactoryEngineData &
 *  input.InputEngineData &
 *  {
 *      managersData: PlayerManagerData[],
 *  }
 * )} engineData
 * @property {geom.Point} pos
 * @property {number} id
 * @property {number} type 
 */

/**
 * @param {PlayerManagerData} managerData
 */
export async function handleRegisterManager(managerData) {
    managerData.img = await render.loadImage('dirge-0001');
}

/**
 * @param {PlayerActorData} actorData
 */
export function handleCreateActor(actorData) {
    
}

/**
 * @param {PlayerActorData} actorData 
 */
export function handleRenderActor(actorData) {
    const managerData = actorData.engineData.managersData[actorData.type];
    const img = managerData.img;
    const ctx = actorData.engineData.ctx;
    const pos = actorData.pos;
    ctx.drawImage(img, pos.x|0, pos.y|0);
}

/**
 * @param {PlayerActorData} actorData 
 */
export function handleDestroyActor(actorData) {

}

/**
 * @param {PlayerActorData} actorData 
 */
export function handleUpdateActor(actorData) {
    const inputPos = actorData.engineData.inputPos;
    actorData.pos.x += inputPos.x;
    actorData.pos.y += inputPos.y;
}
