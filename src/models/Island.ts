import type { Interface } from "readline";
import type { GameState } from "../types/GameState";
import { timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import type { ItemType } from "../types/Item";

type IslandNames = 'Barataria Bay' | 'Port Royal' | 'Tortuga' | 'Prince Edward Island'
type IslandCommoditiesTable = Record<ItemType, number>[];

export type Island = {
    name: IslandNames,
    commodities: IslandCommoditiesTable
}

const islands: Island[] = [
    {
        name: "Barataria Bay",
        commodities: [
            {
                "Food": 1.00,
                "Weapon": 1.00,
                "Luxury": 1.00,
                "Natural Resource": 1.00,
                "Alcohol": 1.00,
                "Common": 1.00,
                "Medicine": 1.00
            }
        ]
    },
    {
        name: "Port Royal",
        commodities: [
            {
                "Food": 1.00,
                "Weapon": 1.00,
                "Luxury": 1.00,
                "Natural Resource": 1.00,
                "Alcohol": 1.00,
                "Common": 1.00,
                "Medicine": 1.00
            }
        ]
    },
    {
        name: "Tortuga",
        commodities: [
            {
                "Food": 1.00,
                "Weapon": 1.00,
                "Luxury": 1.00,
                "Natural Resource": 1.00,
                "Alcohol": 1.00,
                "Common": 1.00,
                "Medicine": 1.00
            }
        ]
    },
    {
        name: "Prince Edward Island",
        commodities: [
            {
                "Food": 1.00,
                "Weapon": 1.00,
                "Luxury": 1.00,
                "Natural Resource": 1.00,
                "Alcohol": 1.00,
                "Common": 1.00,
                "Medicine": 1.00
            }
        ]
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

function assignAllRoutes(islandsById: IslandRegistry): IslandRoutes {
    const islandRoutes: IslandRoutes = {};
    for (const island of Object.entries(islandsById)) {
        const islandId = Number(Object.keys(island));
        islandRoutes[islandId] = assignRoutes(island);
    }

    return islandRoutes;
}

function assignRoutes(island: [string, Island]): Route[] {
    return [];
}

class WorldGraph {
    private _islandsById: IslandRegistry;
    private _routesFrom: IslandRoutes;

    constructor() {
        this._islandsById = assignIslandIds();
        // this._routesFrom = {
        //     1: [{
        //         to: 2,
        //         distanceKm: 1,
        //         travelDays: 1,
        //         encounterTable: {
        //             1: 'Pirates',
        //             99: 'Lightning Strikes'
        //         }
        //     }]
        // }
        this._routesFrom = assignAllRoutes(this.islandsById)
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
    console.log(x.islandsById);
    printAvailableRoutes();
    await timeoutInSeconds(3);
    return 'At Island'
}

function printAvailableRoutes() {
    console.log('Available Routes:');
}

