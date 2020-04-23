// @ts-check

import * as app from '../app.js';
import * as factory from './factory.js';
import * as update from './update.js';
import * as geom from '../geom.js';

/**
 * @typedef {(
 *  factory.FactoryEngineData &
 *  update.UpdateEngineData &
 *  {
 *      actorsData: CollisionActorData[],
 *      managersData: CollisionManagerData[],
 *  }
 * )} CollisionEngineData
 */

/**
 * @typedef {(
 *  factory.FactoryManagerData &
 *  update.UpdateManagerData
 * )} CollisionManagerData
 */

/**
 * @typedef {(
 *  factory.FactoryActorData &
 *  update.UpdateActorData &
 *  {
 *      collision: {
 *          geoms: Array<{
 *              mask: number;
 *              rect: geom.Rect;
 *          }>;
 *          collisions: Array<{
 *              actor: CollisionActorData,
 *              field: number;
 *              intersection: geom.Rect;
 *          }>;
 *      }
 *  }
 * )} CollisionActorData
 */

/**
 * @type {app.Engine}
 */
export const engine = {
    async handleRegisterEngine(engineData) {
        update.registerUpdater(engineData, handleCollisions, 1);
    }
};

/**
 * @param {CollisionEngineData} engineData 
 */
function handleCollisions(engineData) {
    const actorsData = engineData.actorsData;
    for (let i = 0; i < actorsData.length; i++) {
        const a = actorsData[i];
        if (!a || !a.active || !a.collision) {
            continue;
        }
        for (let j = i+1; j < actorsData.length; j++) {
            const b = actorsData[j];
            if (!b || !b.active || !b.collision) {
                continue;
            }
            for (let k = 0; k < a.collision.geoms.length; k++) {
                const aGeom = a.collision.geoms[k];
                for (let l = 0; l < b.collision.geoms.length; l++) {
                    const bGeom = b.collision.geoms[l];
                    for (let m = 0; m < 8; m++) {
                        const mask = 1 << m;
                        if (!(aGeom.mask & bGeom.mask & mask)) {
                            continue;
                        }
                    }
                }
            }
        }
    }
}