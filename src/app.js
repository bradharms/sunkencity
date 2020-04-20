// @ts-check

/**
 * @typedef {Object} AppData
 * @property {Engine[]} engines
 */

/**
 * @typedef {Object} Engine
 * @property {(data: any) => Promise<void>} [handleRegisterEngine]
 * @property {(data: any) => void} [handleStartEngine] 
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
        if (!engine || !engine.handleStartEngine) {
            continue;
        }
        await engine.handleRegisterEngine(data);
    }

    return data;
}

/**
 * @param {AppData} data 
 */
export function start(data) {
    for (let i = 0; i < data.engines.length; i++) {
        const engine = data.engines[i];
        if (!engine || !engine.handleStartEngine) {
            continue;
        }
        engine.handleStartEngine(data);
    }
}
