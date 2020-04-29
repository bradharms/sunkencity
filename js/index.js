// @ts-check

import * as app from './app.js';

import * as factory from './components/factory.js';
import * as input from './components/input.js';
import * as render from './components/render.js';
import * as update from './components/update.js';

import * as background from './actors/background.js';
import * as player from './actors/player.js';
import * as wall from './actors/wall.js';

const AT_PLAYER = 0;
const AT_BACKGROUND = 1;
const AT_WALL = 2;

const AID0_PLAYER = 0;
const AIDN_PLAYER = 0;
const AID0_BACKGROUND = 1;
const AIDN_BACKGROUND = 1
const AID0_WALL = 2;
const AIDN_WALL = 136;

const SCREEN = {
    x: 240,
    y: 160,
}

window.onload = async function main() {
    const engineData = /** @type {(
        app.AppData &
        factory.FactoryEngineData &
        input.InputEngineData &
        render.RenderEngineData &
        update.UpdateEngineData
    )} */ (await app.create([
        factory.engine,
        input.engine,
        update.engine,
        render.engine,
    ]));
    engineData.canvas.width = SCREEN.x;
    engineData.canvas.height = SCREEN.y;
    
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
            x: 32,
            y: 64,
        },
        id: AID0_PLAYER,
        image: null,
        imageOffset: {
            x: 0,
            y: 0,
        },
        type: AT_PLAYER,
        zIndex: 0,
    };
    factory.createActor(engineData, aPlayer);

    let x = 0;
    let y = 16;
    for (let id = AID0_WALL; id <= AIDN_WALL; id++) {
        /**
         * @type {wall.WallActorData}
         */
        const aWall = {
            type: AT_WALL,
            id,
            active: false,
            image: null,
            zIndex: 0,
            imageOffset: { x: 0, y: 0 },
            pos: { x, y },
            shape: (
                ((x == 0 || x == (SCREEN.x - 16)) && y == 16) ? 4 :
                (x == 0 || x == (SCREEN.x - 16)) ? 3 :
                (y == 16 || y == (SCREEN.y - 16)) ? 2 :
                y == 32 ? 1 :
                0
            ),
        };
        factory.createActor(engineData, aWall);
        x += 16;
        if (x >= SCREEN.x) {
            x = 0;
            y += 16;
        }
    }

    app.start(engineData);
}
