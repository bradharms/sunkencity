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
 *      actorsData: CollisionActorData[];
 *      managersData: CollisionManagerData[];
 *      collisions: Array<{
 *          actorA: CollisionActorData;
 *          actorB: CollisionActorData;
 *          fields: number;
 *          rect: geom.Rect;
 *      }>
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
 *      pos: geom.Point;
 *      collision: {
 *          geoms: Array<{
 *              maskA: number;
 *              maskB: number;
 *              rect: geom.Rect;
 *          }>;
 *          collisions: Array<number>;
 *      }
 *  }
 * )} CollisionActorData
 */

/**
 * @type {app.Engine}
 */
export const engine = {
    /**
     * @param {CollisionEngineData} engineData 
     */
    async onRegister(engineData) {
        update.registerUpdater(engineData, handleCollisions, 1);
        engineData.collisions = [];
        for (let i = 0; i < 1024; i++) {
            engineData.collisions[i] = {
                actorA: null,
                actorB: null,
                fields: 0,
                rect: {
                    x: 0,
                    y: 0,
                    w: 0,
                    h: 0,
                }
            };
        }
    }
};

/**
 * @param {CollisionEngineData} engineData 
 */
function handleCollisions(engineData) {
    const actors = engineData.actorsData;
    let collisionIndex = 1;
    for (let aA = 0; aA < actors.length; aA++) {
        const col = engineData.collisions[collisionIndex];
        col.actorA = actors[aA];
        if (!col.actorA || !col.actorA.active || !col.actorA.collision) {
            continue;
        }
        col.actorA.collision.collisions = [];
        for (let aB = aA + 1; aB < actors.length; aB++) {
            col.actorB = actors[aB];
            if (!col.actorB || !col.actorB.active || !col.actorB.collision) {
                continue;
            }
            col.actorB.collision.collisions = [];
            for (let gA = 0; gA < col.actorA.collision.geoms.length; gA++) {
                const geomA = col.actorA.collision.geoms[gA];
                for (let gB = 0; gB < col.actorB.collision.geoms.length; gB++) {
                    const geomB = col.actorB.collision.geoms[gB];
                    col.fields = geomA.maskA & geomB.maskB; 
                    if (!col.fields) {
                        continue;
                    }
                    const rectA = {
                        x: geomA.rect.x + col.actorA.pos.x,
                        y: geomA.rect.y + col.actorA.pos.y,
                        w: geomA.rect.w,
                        h: geomA.rect.h,
                    }
                    const rectB = {
                        x: geomB.rect.x + col.actorB.pos.x,
                        y: geomB.rect.y + col.actorB.pos.y,
                        w: geomB.rect.w,
                        h: geomB.rect.h,
                    }
                    const rect = col.rect;
                    if (!geom.isIntersecting(rectA, rectB, rect)) {
                        continue;
                    }
                    col.actorA.collision.collisions.push(collisionIndex);
                    col.actorB.collision.collisions.push(collisionIndex);
                    collisionIndex++;
                }
            }
        }
    }
}