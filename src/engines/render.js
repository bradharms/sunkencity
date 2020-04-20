// @ts-check

/**
 * @typedef {Object} RenderEngineData
 * @property {RenderActorData[]} actorsData
 * @property {RenderManager[]} managers
 * @property {RenderManagerData[]} managersData
 * @property {HTMLCanvasElement} canvas
 * @property {CanvasRenderingContext2D} ctx
 */

/**
 * @typedef {Object} RenderActorData
 * @property {RenderEngineData} engineData
 * @property {number} type
 */

/**
 * @typedef {Object} RenderManager
 * @property {(
 *  managerData: RenderManagerData,
 * ) => void} [handleRenderBeforeActors]
 * @property {(actorData: RenderActorData) => void} [handleRenderActor]
 * @property {(
 *  managerData: RenderManagerData
 * ) => void} [handleRenderAfterActors]
 */

/**
 * @typedef {Object} RenderManagerData
 * @property {RenderEngineData} engineData 
 */

/**
 * @param {RenderEngineData} data
 */
export async function handleRegisterEngine(data) {
    data.canvas = /** @type {*} */ (document.getElementById('canvas'));
    data.ctx = data.canvas.getContext('2d');
}

/**
 * @param {RenderEngineData} data
 */
export function handleStartEngine(data) {
    const handle = () => {
        render(data);
        window.requestAnimationFrame(handle);
    }
    handle();
}

/**
 * @param {RenderEngineData} data
 */
function render(data) {
    for (let i = 0; i < data.managers.length; i++) {
        const manager = data.managers[i];
        if (!manager || !manager.handleRenderBeforeActors) {
            continue;
        }
        const managerData = data.managersData[i];
        manager.handleRenderBeforeActors(managerData);
    }
    for (let i = 0; i < data.actorsData.length; i++) {
        const actor = data.actorsData[i];
        if (!actor) {
            continue;
        }
        const manager = data.managers[actor.type];
        if (!manager.handleRenderActor) {
            continue;
        }
        const managerData = data.managersData[actor.type];
        manager.handleRenderActor(actor);
    }
    for (let i = 0; i < data.managers.length; i++) {
        const manager = data.managers[i];
        if (!manager || !manager.handleRenderAfterActors) {
            continue;
        }
        const managerData = data.managersData[i];
        manager.handleRenderAfterActors(managerData);
    }
}

/**
 * @param {string} name
 */
const getImageSrc = (name) => `/assets/img/${name}.png`;

/**
 * 
 * @param {string} name
 * @return {Promise<HTMLImageElement>}
 */
export function loadImage(name) {
    return new Promise((resolve, reject) => {
        const imgEl = document.createElement('img');
        imgEl.onload = (e) => {
            resolve(imgEl);
        };
        imgEl.src = getImageSrc(name);
    });
}
