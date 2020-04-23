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
 *      updaters: [
 *          Updater[],
 *          Updater[],
 *          Updater[],
 *          Updater[],
 *          Updater[]
 *      ];
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
 * @typedef {(engineData: UpdateEngineData) => void} Updater
 */

/**
 * @typedef {{
 *  handleUpdateActor?(
 *      actorData: UpdateActorData,
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
     * @param {UpdateEngineData} engineData
     */
    async onRegister(engineData) {
        engineData.updaters = [[], [], [], [], []];
        registerUpdater(engineData, handleUpdateActors, 2);
    },
    
    /**
     * @param {UpdateEngineData} engineData
     */
    onStart(engineData) {
        const handle = () => {
            runUpdaters(engineData);
            window.requestAnimationFrame(handle);
        }
        handle();
    },
}

/**
 * @param {UpdateEngineData} engineData
 * @param {Updater} updater
 * @param {0|1|2|3|4} phase
 */
export function registerUpdater(engineData, updater, phase) {
    engineData.updaters[phase].push(updater);
}

/**
 * @param {UpdateEngineData} engineData
 */
function runUpdaters(engineData) {
    for (let i = 0; i < engineData.updaters.length; i++) {
        const updaters = engineData.updaters[i];
        for (let j = 0; j < updaters.length; j++) {
            const updater = updaters[j];
            updater(engineData);
        }
    }
}

/**
 * @param {UpdateEngineData} engineData
 */
function handleUpdateActors(engineData) {
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
}
