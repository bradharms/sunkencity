// @ts-check

/**
 * @typedef {Object} AppData
 * @property {Engine[]} engines
 */

/**
 * @typedef {Object} Engine
 * @property {(data: any) => Promise<void>} [onRegister]
 * @property {(data: any) => void} [onStart] 
 */

/**
 * @param {Engine[]} engines 
 * @return {Promise<AppData>} 
 */
export async function create(engines) {
    /**
     * @type {AppData}
     */
    const data = {
        engines: []
    };
    
    for (let i = 0; i < engines.length; i++) {
        const engine = engines[i];
        data.engines.push(engine);
        if (!engine || !engine.onRegister) {
            continue;
        }
        await engine.onRegister(data);
    }

    return data;
}

/**
 * @param {AppData} data 
 */
export function start(data) {
    for (let i = 0; i < data.engines.length; i++) {
        const engine = data.engines[i];
        if (!engine || !engine.onStart) {
            continue;
        }
        engine.onStart(data);
    }
}
