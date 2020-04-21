// @ts-check

import * as factory from './factory.js';
import * as geom from '../geom.js';

/**
 * @typedef {(
 *  factory.FactoryEngineData &
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
 *  factory.FactoryActorData &
 *  {
 *      image: HTMLImageElement;
 *      pos: geom.Point;
 *      imageOffset: geom.Point;
 *      zIndex: number;
 *  }
 * )} RenderActorData
 */

/**
 * @typedef {(
 *  factory.FactoryManagerData
 * )} RenderManagerData 
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
 * @param {RenderEngineData} engineData
 */
export async function handleRegisterEngine(engineData) {
    engineData.canvas = /** @type {*} */ (document.getElementById('canvas'));
    engineData.ctx = engineData.canvas.getContext('2d');
}

/**
 * @param {RenderEngineData} engineData
 */
export function handleStartEngine(engineData) {
    const handle = () => {
        renderAll(engineData);
        window.requestAnimationFrame(handle);
    }
    handle();
}

/**
 * @param {RenderEngineData} engineData
 */
function renderAll(engineData) {
    for (let i = 0; i < engineData.managers.length; i++) {
        const manager = engineData.managers[i];
        if (!manager || !manager.handleRenderBeforeActors) {
            continue;
        }
        const managerData = engineData.managersData[i];
        manager.handleRenderBeforeActors(managerData, engineData);
    }
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
    geom.addPoints(pos, imageOffset, tmpPos);
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
