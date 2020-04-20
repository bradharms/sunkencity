// @ts-check

/**
 * @typedef {Object} UpdateEngineData
 * @property {UpdateActorData[]} actorsData
 * @property {UpdateManager[]} managers 
 * @property {UpdateManagerData[]} managersData
 */

/**
 * @typedef {Object} UpdateActorData
 * @property {UpdateEngineData} engineData
 * @property {number} type
 */

/**
 * @typedef {Object} UpdateManager
 * @property {(
 *  managerData: UpdateManagerData
 * ) => void} handleUpdateBeforeActors
 * @property {(actorData: UpdateActorData) => void} handleUpdateActor
 * @property {(
 *  managerData: UpdateManagerData
 * ) => void} handleUpdateAfterActors 
 */

/**
 * @typedef {Object} UpdateManagerData
 * @property {UpdateEngineData} engineData 
 */

const UPDATE_RATE = 1000 / 60;

/**
 * @param {UpdateEngineData} data
 */
export async function handleRegisterEngine(data) {
    
}

/**
 * @param {UpdateEngineData} data
 */
export function handleStartEngine(data) {
    const handle = () => {
        updateActors(data);
        window.requestAnimationFrame(handle);
    }
    handle();
}

/**
 * @param {UpdateEngineData} data
 */
function updateActors(data) {
    for (let i = 0; i < data.managers.length; i++) {
        const manager = data.managers[i];
        if (!manager || !manager.handleUpdateBeforeActors) {
            continue;
        }
        const managerData = data.managersData[i];
        manager.handleUpdateBeforeActors(managerData);
    }
    for (let i = 0; i < data.actorsData.length; i++) {
        const actor = data.actorsData[i];
        if (!actor) {
            continue;
        }
        const manager = data.managers[actor.type];
        if (!manager.handleUpdateActor) {
            continue;
        }
        manager.handleUpdateActor(actor);
    }
    for (let i = 0; i < data.managers.length; i++) {
        const manager = data.managers[i];
        if (!manager || !manager.handleUpdateBeforeActors) {
            continue;
        }
        const managerData = data.managersData[i];
        manager.handleUpdateAfterActors(managerData);
    }
}
