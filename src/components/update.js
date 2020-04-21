// @ts-check

import * as app from '../app.js';
import * as factory from './factory.js';

/**
 * @typedef {(
 *  factory.FactoryEngineData &
 *  {
 *      actorsData: UpdateActorData[];
 *      managers: UpdateManager[];
 *      managersData: UpdateManagerData[];
 *  }
 * )} UpdateEngineData
 */

/**
 * @typedef {(
 *  factory.FactoryActorData
 * )} UpdateActorData
 */

/**
 * @typedef {(
 *  factory.FactoryManagerData
 * )} UpdateManagerData 
 */

/**
 * @typedef {{
 *  handleUpdateBeforeActors?(
 *      managerData: UpdateManagerData,
 *      engineData: UpdateEngineData,
 *  ): void;
 *  handleUpdateActor?(
 *      actorData: UpdateActorData,
 *      managerData: UpdateManagerData,
 *      engineData: UpdateEngineData
 *  ): void;
 *  handleUpdateAfterActors?(
 *      managerData: UpdateManagerData,
 *      engineData: UpdateEngineData
 *  ): void; 
 * }} UpdateManager
 */

/**
 * @type {app.Engine}
 */
export const engine = {
    /**
     * @param {UpdateEngineData} data
     */
    async handleRegisterEngine(data) { },
    
    /**
     * @param {UpdateEngineData} engineData
     */
    handleStartEngine(engineData) {
        const handle = () => {
            updateAll(engineData);
            window.requestAnimationFrame(handle);
        }
        handle();
    },
}

/**
 * @param {UpdateEngineData} engineData
 */
function updateAll(engineData) {
    for (let i = 0; i < engineData.managers.length; i++) {
        const manager = engineData.managers[i];
        if (!manager || !manager.handleUpdateBeforeActors) {
            continue;
        }
        const managerData = engineData.managersData[i];
        manager.handleUpdateBeforeActors(managerData, engineData);
    }
    for (let i = 0; i < engineData.actorsData.length; i++) {
        const actorData = engineData.actorsData[i];
        if (!actorData || !actorData.active) {
            continue;
        }
        const manager = engineData.managers[actorData.type];
        if (!manager.handleUpdateActor) {
            continue;
        }
        const managerData = engineData.managersData[actorData.type];
        manager.handleUpdateActor(actorData, managerData, engineData);
    }
    for (let i = 0; i < engineData.managers.length; i++) {
        const manager = engineData.managers[i];
        if (!manager || !manager.handleUpdateBeforeActors) {
            continue;
        }
        const managerData = engineData.managersData[i];
        manager.handleUpdateAfterActors(managerData, engineData);
    }
}
