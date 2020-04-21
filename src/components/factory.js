// @ts-check

import * as app from '../app.js';

/**
 * @typedef {{
 *  actorsData: FactoryActorData[];
 *  managers: FactoryManager[];
 *  managersData: FactoryManagerData[];
 * }} FactoryEngineData
 */

/**
 * @typedef {{
 *  type: number;
 *  id: number;
 *  active: boolean;
 * }} FactoryActorData
 */

/**
 * @typedef {{
 *  id: number;
 * }} FactoryManagerData 
 */

/**
 * @typedef {{
 *  handleRegisterManager?(
 *      managerData: FactoryManagerData,
 *      engineData: FactoryEngineData
 *  ): Promise<void>;
 *  handleStartManager?(
 *      managerData: FactoryManagerData,
 *      engineData: FactoryEngineData
 *  ): void;
 *  handleDestroyManager?(
 *      managerData: FactoryManagerData,
 *      engineData: FactoryEngineData
 *  ): void;
 *  handleCreateActor?(
 *      actorData: FactoryActorData,
 *      managerData: FactoryManagerData,
 *      engineData: FactoryEngineData
 *  ): void;
 *  handleStartActor?(
 *      actorData: FactoryActorData,
 *      managerData: FactoryManagerData,
 *      engineData: FactoryEngineData,
 *  ): void;
 *  handleDestroyActor?(
 *      actorData: FactoryActorData,
 *      managerData: FactoryManagerData,
 *      engineData: FactoryEngineData
 *  ): void;
 * }} FactoryManager
 */

/**
 * @type {app.Engine}
 */
export const engine = {
    /**
     * @param {FactoryEngineData} data 
     */
    async handleRegisterEngine(data) {
        data.actorsData = [];
        data.managers = [];
        data.managersData = [];
    },
    
    /**
     * @param {FactoryEngineData} engineData 
     */
    async handleStartEngine(engineData) {
        for (let i = 0; i < engineData.managers.length; i++) {
            const manager = engineData.managers[i];
            if (!manager || !manager.handleStartManager) {
                continue;
            }
            const managerData = engineData.managersData[i];
            manager.handleStartManager(managerData, engineData);
        }
        for (let i = 0; i < engineData.actorsData.length; i++) {
            const actorData = engineData.actorsData[i];
            if (!actorData || !actorData.active) {
                continue;
            }
            const manager = engineData.managers[actorData.type];
            if (!manager || !manager.handleStartActor) {
                continue;
            }
            const managerData = engineData.managersData[actorData.type];
            manager.handleStartActor(actorData, managerData, engineData);
        }
    }
};

/**
 * @param {FactoryEngineData} engineData
 * @param {FactoryManager} manager
 * @param {FactoryManagerData} managerData
 */ 
export async function registerManager(engineData, managerData, manager) {
    const id = managerData.id;
    engineData.managers[id] = manager;
    engineData.managersData[id] = managerData;
    if (!manager.handleRegisterManager) {
        return;
    }
    await manager.handleRegisterManager(managerData, engineData);
}

/**
 * @param {FactoryEngineData} engineData
 * @param {FactoryActorData} actorData
 */
export function createActor(engineData, actorData) {
    actorData.active = true;
    engineData.actorsData[actorData.id] = actorData;
    const manager = engineData.managers[actorData.type];
    if (!manager.handleCreateActor) {
        return;
    }
    const managerData = engineData.managersData[actorData.type];
    manager.handleCreateActor(actorData, managerData, engineData);
}

/**
 * @param {FactoryEngineData} engineData
 * @param {FactoryActorData} actorData
 */
export function destroyActor(engineData, actorData) {
    const manager = engineData.managers[actorData.type];
    actorData.active = false;
    if (!manager.handleDestroyActor) {
        return;
    }
    const managerData = engineData.managersData[actorData.id];
    manager.handleDestroyActor(actorData, managerData, engineData);
}
