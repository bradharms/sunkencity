// @ts-check

import * as factory from '../components/factory.js';
import * as render from '../components/render.js';

/**
 * @typedef {(
 *  factory.FactoryEngineData &
 *  render.RenderEngineData
 * )} WallEngineData 
 */

/**
 * @typedef {(
 *  factory.FactoryManagerData &
 *  render.RenderManagerData &
 *  {
 *      images: HTMLImageElement[]
 *  }
 * )} WallManagerData
 */

/**
 * @typedef {(
 *  factory.FactoryActorData &
 *  render.RenderActorData
 * )} WallActorData 
 */

/**
 * @type {(
 *  factory.FactoryManager &
 *  render.RenderManager
 * )}
 */
export const manager = {
    /**
     * @param {WallManagerData} managerData
     * @param {WallEngineData} engineData
     */
    async handleRegisterManager(managerData, engineData) {
        const images = managerData.images;
        images[0] = await render.loadImage('floor-0001');
        images[1] = await render.loadImage('floor-0002');
        images[2] = await render.loadImage('floor-0003');
        images[3] = await render.loadImage('floor-0004');
        images[4] = await render.loadImage('floor-0005');
    },

    /**
     * @param {WallActorData} actorData
     * @param {WallManagerData} managerData
     * @param {WallEngineData} engineData
     */
    handleStartActor(actorData, managerData, engineData) {

    }
};
