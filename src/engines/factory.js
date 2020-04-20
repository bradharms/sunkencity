// @ts-check

/**
 * @typedef {Object} FactoryEngineData
 * @property {FactoryActorData[]} actorsData
 * @property {FactoryManager[]} managers
 * @property {FactoryManagerData[]} managersData
 */

/**
 * @typedef {Object} FactoryActorData
 * @property {FactoryEngineData} engineData
 * @property {number} type
 * @property {number} id
 */

/**
 * @typedef {Object} FactoryManager
 * @property {(
 *  managerData: FactoryManagerData
 * ) => Promise<void>} [handleRegisterManager]
 * @property {(managerData: FactoryManagerData) => void} [handleStartManager]
 * @property {(manager: FactoryManager) => void} [handleDestroyManager]
 * @property {(actorData: FactoryActorData) => void} handleCreateActor
 * @property {(actorData: FactoryActorData) => void} handleDestroyActor
 */

/**
 * @typedef {Object} FactoryManagerData
 * @property {FactoryEngineData} engineData 
 */

/**
 * @param {FactoryEngineData} data 
 */
export async function handleRegisterEngine(data) {
    data.actorsData = [];
    data.managers = [];
    data.managersData = [];
}

/**
 * @param {FactoryEngineData} data 
 */
export async function handleStartEngine(data) {
    for (let i = 0; i < data.managers.length; i++) {
        const manager = data.managers[i];
        if (!manager || !manager.handleStartManager) {
            continue;
        }
        manager.handleStartManager(data.managersData[i]);
    }
}

/**
 * @template {FactoryManager} T
 * @param {FactoryEngineData} data
 * @param {T} manager 
 */
export async function registerManager(data, manager) {
    data.managers.push(manager);
    const id = data.managers.length - 1;
    const managerData = {
        engineData: data,
    };
    data.managersData.push(managerData);
    if (!manager.handleRegisterManager) {
        return;
    }
    await manager.handleRegisterManager(managerData);
    return id;
}

/**
 * @param {FactoryEngineData} data
 * @param {(
 *  Omit<FactoryActorData, 'engineData'|'id'> & {
 *      engineData?: FactoryEngineData;
 *      id?: number;
 *  }
 * )} actorData
 */
export function createActor(data, actorData) {
    for (let i = 0; i <= data.actorsData.length; i++) {
        if (data.actorsData[i]) {
            continue;
        }
        actorData.engineData = data;
        actorData.id = i;
        data.actorsData[i] = /** @type {FactoryActorData} */ (actorData);
        const manager = data.managers[actorData.type];
        if (manager.handleCreateActor) {
            manager.handleCreateActor(
                /** @type {FactoryActorData} */ (actorData)
            );
        }
        return;
    }
}

/**
 * @param {FactoryEngineData} data
 * @param {number} i 
 */
export function removeActorById(data, i) {
    const actorData = data.actorsData[i];
    const manager = data.managers[actorData.type];
    if (manager.handleDestroyActor) {
        manager.handleDestroyActor(actorData);
    }
    data.actorsData[i] = null;
}
