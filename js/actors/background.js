// @ts-check

import * as factory from '../components/factory.js';
import * as render from '../components/render.js';

/**
 * @typedef {(
 *  factory.FactoryEngineData &
 *  render.RenderEngineData
 * )} BackgroundEngineData 
 */

/**
 * @typedef {(
 *  factory.FactoryManagerData &
 *  render.RenderManagerData
 * )} BackgroundManagerData
 */

/**
 * @type {(
 *  factory.FactoryManager &
 *  render.RenderManager
 * )}
 */
export const manager = {
    async handleRegisterManager() { },

    handleRenderBeforeActors(managerData, engineData) {
        const ctx = engineData.ctx;
        const canvas = engineData.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};
