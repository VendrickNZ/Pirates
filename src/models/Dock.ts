import type { Interface } from "readline";
import type { GameState } from "../types/GameState";
import { timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";

type DockNames = 'Barataria Bay' | 'Port Royal' | 'Tortuga' | 'Prince Edward Island'
export type Dock = Record<'name', DockNames>;

const docks: Dock[] = [
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

type DockId = number;
type DockRegistry = Record<DockId, Dock>;
type DockRoutes = Record<DockId, Route[]>;

function assignDockIds(): DockRegistry {
    const registry: DockRegistry = {};
    for (const dockIndex in docks) {
        const key = Number(dockIndex)
        registry[key] = docks[key]
    }

    return registry;
}

function assignRoutes(docksById: DockRegistry): DockRoutes {
    for (const dock of docksById) {

    }
}

class WorldGraph {
    private _docksById: DockRegistry;
    private _routesFrom: DockRoutes;

    constructor() {
        this._docksById = assignDockIds();
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

    get docksById() {
        return this._docksById;
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

export function getDocks(): Dock[] {
    return docks;
}

/** The starting dock of Port Royal */
export function getStartingDock(): Dock {
    const docks = getDocks()
    return docks.find(d => d.name === 'Port Royal')!;
}

export async function visitDocks(player: Player, rl: Interface): Promise<GameState> {
    const x = new WorldGraph();
    x.docksById;
    printAvailableRoutes()
    await timeoutInSeconds(3);
    return 'At Island'
}

function printAvailableRoutes() {
    console.log('Available Routes:');
}

