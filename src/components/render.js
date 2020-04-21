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
 *      actorsData: RenderActorData[];
 *      managers: RenderManager[];
 *      managersData: RenderManagerData[];
 *      canvas: HTMLCanvasElement;
 *      ctx: CanvasRenderingContext2D;
 *  }
 * )} RenderEngineData
 */

/**
 * @typedef {(
 *  factory.FactoryManagerData &
 *  update.UpdateManagerData
 * )} RenderManagerData 
 */

/**
 * @typedef {(
 *  factory.FactoryActorData &
 *  update.UpdateActorData &
 *  {
 *      image: HTMLImageElement;
 *      pos: geom.Point;
 *      imageOffset: geom.Point;
 *      zIndex: number;
 *  }
 * )} RenderActorData
 */

/**
 * @typedef {{
 *  handleRenderBeforeActors?(
 *      managerData: RenderManagerData,
 *      engineData: RenderEngineData,
 *  ): void;
 *  handleRenderActor?(
 *      actorData: RenderActorData,
 *      managerData: RenderManagerData,
 *      engineData: RenderEngineData
 *  ): void;
 *  handleRenderAfterActors?(
 *      managerData: RenderManagerData,
 *      engineData: RenderEngineData,
 *  ): void;
 * }} RenderManager
 */

/**
 * @type {app.Engine}
 */
export const engine = {
    /**
     * @param {RenderEngineData} engineData
     */
    async handleRegisterEngine(engineData) {
        engineData.canvas =
            /** @type {*} */ (document.getElementById('canvas'));
        engineData.ctx = engineData.canvas.getContext('2d');
        console.log('about to register render handlers');
        update.registerUpdater(engineData, handleRenderBeforeActors, 3);
        update.registerUpdater(engineData, handleRenderActors, 3);
        update.registerUpdater(engineData, handleRenderAfterActors, 3);
    },
};

/**
 * @param {RenderEngineData} engineData
 */
function handleRenderBeforeActors(engineData) {
    for (let i = 0; i < engineData.managers.length; i++) {
        const manager = engineData.managers[i];
        if (!manager || !manager.handleRenderBeforeActors) {
            continue;
        }
        const managerData = engineData.managersData[i];
        manager.handleRenderBeforeActors(managerData, engineData);
    }
}

/**
 * @param {RenderEngineData} engineData 
 */
function handleRenderActors(engineData) {
    for (let i = 0; i < engineData.actorsData.length; i++) {
        tmpZSortedActors[i] = engineData.actorsData[i];
    }
    tmpZSortedActors.sort(sortActorsByZIndex);
    for (let i = 0; i < tmpZSortedActors.length; i++) {
        const actorData = tmpZSortedActors[i];
        if (!actorData || !actorData.active) {
            continue;
        }
        const manager = engineData.managers[actorData.type];
        if (!manager) {
            continue;
        }
        const handleRenderActor =
            manager.handleRenderActor || defaultHandleRenderActor;
        const managerData = engineData.managersData[actorData.type];
        handleRenderActor(actorData, managerData, engineData);
    }
}
/**
 * @type {RenderActorData[]} tmpZSortedActors 
 */
const tmpZSortedActors = [];
/**
 * @param {RenderActorData} a 
 * @param {RenderActorData} b 
 */
function sortActorsByZIndex(a, b) {
    return b.zIndex - a.zIndex;
}

/**
 * @param {RenderEngineData} engineData
 */
function handleRenderAfterActors(engineData) {
    for (let i = 0; i < engineData.managers.length; i++) {
        const manager = engineData.managers[i];
        if (!manager || !manager.handleRenderAfterActors) {
            continue;
        }
        const managerData = engineData.managersData[i];
        manager.handleRenderAfterActors(managerData, engineData);
    }
}

/**
 * @param {RenderActorData} actorData
 * @param {RenderManagerData} managerData
 * @param {RenderEngineData} engineData 
 */
export function defaultHandleRenderActor(actorData, managerData, engineData) {
    const image = actorData.image;
    if (!image) {
        return;
    }
    const pos = actorData.pos || zeroPos;
    const imageOffset = actorData.imageOffset || zeroPos; 
    geom.move(pos, imageOffset, tmpPos);
    engineData.ctx.drawImage(image, tmpPos.x|0, tmpPos.y|0);
}
/** @type {geom.Point} */
const zeroPos = {x: 0, y: 0};
/** @type {geom.Point} */
const tmpPos = {x: 0, y: 0};

/**
 * @param {string} name
 * @return {Promise<HTMLImageElement>}
 */
export function loadImage(name) {
    return new Promise((resolve, reject) => {
        const imgEl = document.createElement('img');
        imgEl.onload = (e) => {
            resolve(imgEl);
        };
        imgEl.src = `/assets/img/${name}.png`;
    });
}
