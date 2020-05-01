// @ts-check

import * as app from '../app.js';
import * as render from '../components/render.js';
import * as factory from '../components/factory.js';
import * as input from '../components/input.js';
import * as update from '../components/update.js';
import * as collision from '../components/collision.js';

/** @typedef {(
 *      factory.FactoryEngineData &
 *      update.UpdateEngineData &
 *      render.RenderEngineData &
 *      input.InputEngineData &
 *      collision.CollisionEngineData &
 *      app.AppData &
 *      {
 *          managersData: PlayerManagerData[],
 *      }
 * )} PlayerEngineData
 */

/**
 * @typedef {(
 *  factory.FactoryManagerData &
 *  update.UpdateManagerData &
 *  render.RenderManagerData &
 *  collision.CollisionManagerData &
 *  {
 *      image: HTMLImageElement,
 *  }
 * )} PlayerManagerData
 */

/**
 * @typedef {(
 *  factory.FactoryActorData &
 *  update.UpdateActorData &
 *  render.RenderActorData &
 *  collision.CollisionActorData
 * )} PlayerActorData 
 */

/** @type {(
 *  factory.FactoryManager &
 *  render.RenderManager &
 *  update.UpdateManager
 * )}
 */
export const manager = {
    /**
     * @param {PlayerManagerData} managerData
     * @param {PlayerEngineData} engineData
     */
    async handleRegisterManager(managerData, engineData) {
        managerData.image = await render.loadImage('dirge-0001');
    },

    /**
     * @param {PlayerActorData} actorData
     * @param {PlayerManagerData} managerData
     * @param {PlayerEngineData} engineData 
     */
    handleCreateActor(actorData, managerData, engineData) {
        actorData.image = managerData.image;
    },

    /**
     * @param {PlayerActorData} actorData
     * @param {PlayerManagerData} managerData
     * @param {PlayerEngineData} engineData
     */
    handleUpdateActor(actorData, managerData, engineData) {
        actorData.imageOffset.y = -16;
        const previousPos = {
            x: actorData.pos.x,
            y: actorData.pos.y
        }
        actorData.pos.x += engineData.inputPos.x;
        actorData.pos.y += engineData.inputPos.y;
        actorData.zIndex = -actorData.pos.y;

        for (let i = 0; i < actorData.collision.collisions.length; i++) {
            const col = engineData.collisions[i];
            console.log(col);
        }
    }
};
