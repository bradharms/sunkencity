// @ts-check

import * as app from './app.js';

import * as factory from './engines/factory.js';
import * as input from './engines/input.js';
import * as render from './engines/render.js';
import * as update from './engines/update.js';

import * as background from './managers/background.js';
import * as player from './managers/player.js';

window.onload = async function main() {
    const appData = /** @type {(
        app.AppData &
        factory.FactoryEngineData &
        input.InputEngineData &
        render.RenderEngineData &
        update.UpdateEngineData
    )} */ (await app.create([
        factory,
        input,
        update,
        render,
    ]));
    
    const tBackground =
        await factory.registerManager(appData, /** @type {*} */ (background));

    const tPlayer =
        await factory.registerManager(appData, /** @type {*} */ (player));

    /** @type {player.PlayerActorData} */
    const aPlayer =  {
        id: null,
        engineData: null,
        type: tPlayer,
        pos: {
            x: 30,
            y: 30,
        }
    };
    factory.createActor(appData, aPlayer);

    app.start(appData);
}
