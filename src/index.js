// @ts-check

import * as app from './app.js';

import * as factory from './engines/factory.js';
import * as input from './engines/input.js';
import * as render from './engines/render.js';
import * as update from './engines/update.js';

import * as background from './actors/background.js';
import * as player from './actors/player.js';
import * as wall from './actors/wall.js';

const AT_PLAYER = 0;
const AT_BACKGROUND = 1;
const AT_WALL = 2;
const AID_PLAYER = 0;

window.onload = async function main() {
    const engineData = /** @type {(
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
    
    /** @type {player.PlayerManagerData} */
    const mdPlayer = {
        image: null,
        id: AT_PLAYER,
    };

    /** @type {background.BackgroundManagerData} */
    const mdBackground = {
        id: AT_BACKGROUND,
    };

    /** @type {wall.WallManagerData} */
    const mdWall = {
        id: AT_WALL,
        images: [],
    };
    
    await factory.registerManager(engineData, mdBackground, background.manager);
    await factory.registerManager(engineData, mdPlayer, player.manager);
    await factory.registerManager(engineData, mdWall, wall.manager);

    /**
     * @type {player.PlayerActorData} 
     */
    const aPlayer = {
        active: false,
        pos: {
            x: 30,
            y: 30,
        },
        id: AID_PLAYER,
        image: null,
        imageOffset: {
            x: 0,
            y: 0,
        },
        type: AT_PLAYER,
        zIndex: 0,
    };
    factory.createActor(engineData, aPlayer);

    app.start(engineData);
}
