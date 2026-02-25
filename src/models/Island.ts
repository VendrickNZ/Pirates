import type { Interface } from "readline";
import type { GameState } from "../types/GameState";
import { timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import { GameItems } from "../types/Item";

type IslandNames = 'Barataria Bay' | 'Port Royal' | 'Tortuga' | 'Prince Edward Island'
export type Island = Record<'name', IslandNames>;

const islands: Island[] = [
    {
        "name": "Barataria Bay"
    },
    {
        "name": "Port Royal"
    },
    {
        "name": "Tortuga"
    },
    {
        "name": "Prince Edward Island"
    }
]

type IslandId = number;
type IslandRegistry = Record<IslandId, Island>;
type IslandRoutes = Record<IslandId, Route[]>;

function assignIslandIds(): IslandRegistry {
    const registry: IslandRegistry = {};
    for (const islandIndex in islands) {
        const key = Number(islandIndex)
        registry[key] = islands[key]
    }

    return registry;
}

// function assignRoutes(islandsById: IslandRegistry): IslandRoutes {
//     for (const island of islandsById) {

//     }
// }

class WorldGraph {
    private _islandsById: IslandRegistry;
    private _routesFrom: IslandRoutes;

    constructor() {
        this._islandsById = assignIslandIds();
        this._routesFrom = {
            1: [{
                to: 2,
                distanceKm: 1,
                travelDays: 1,
                encounterTable: {
                    1: 'Pirates',
                    99: 'Lightning Strikes'
                }
            }]
        }
    }

    get islandsById() {
        return this._islandsById;
    }
}


type Route = {
    to: number,
    distanceKm: number,
    travelDays: number,
    encounterTable: Encounters
}

type Encounters = Record<number, Hazards>
type Hazards = 'Pirates' | 'Lightning Strikes'

export function getIslands(): Island[] {
    return islands;
}

/** The starting island of Port Royal */
export function getStartingIsland(): Island {
    const islands = getIslands()
    return islands.find(d => d.name === 'Port Royal')!;
}

export async function visitDocks(player: Player, rl: Interface): Promise<GameState> {
    const x = new WorldGraph();
    x.islandsById;
    printAvailableRoutes();
    for (const item of GameItems) {
        console.log(item.name, item.units);
    }
    await timeoutInSeconds(3);
    return 'At Island'
}

function printAvailableRoutes() {
    console.log('Available Routes:');
}

