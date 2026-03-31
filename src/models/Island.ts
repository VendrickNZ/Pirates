import type { Interface } from "readline";
import type { GameState } from "../types/GameState";
import { timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import type { ItemType } from "../types/Item";
import { allEvents, getRandomEvents, type Encounters } from "../types/Encounters";
import { getRandomInt } from "../utils/NumberUtils";

const MAX_COORDINATE = 1000;
const MIN_COORDINATE = -1000;

type IslandNames = 'Barataria Bay' | 'Port Royal' | 'Tortuga' | 'Prince Edward Island'
type IslandCommoditiesTable = Record<ItemType, number>[];
type IslandLocationVector2 = [number, number];

export type Island = {
    id: IslandId,
    name: IslandNames,
    commodities: IslandCommoditiesTable,
    location: IslandLocationVector2
}

function generateLocation(): IslandLocationVector2 {
    const x = getRandomInt(MIN_COORDINATE, MAX_COORDINATE);
    const y = getRandomInt(MIN_COORDINATE, MAX_COORDINATE);

    const roundedX = parseInt(x.toFixed(0));
    const roundedY = parseInt(y.toFixed(0));

    return [roundedX, roundedY];
}

const islands: Island[] = [
    {
        id: 1,
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
        ],
        location: generateLocation()
    },
    {
        id: 2,
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
        ],
        location: generateLocation()
    },
    {
        id: 3,
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
        ],
        location: generateLocation()
    },
    {
        id: 4,
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
        ],
        location: generateLocation()
    }
]

type IslandId = number;
type IslandRoutes = Record<IslandId, Route[]>;

function assignAllRoutes(): IslandRoutes {
    const islandRoutes: IslandRoutes = {};
    for (const island of islands) {
        const islandId = island.id;
        islandRoutes[islandId] = assignRoutes(island);
    }

    return islandRoutes;
}

function computeDistanceBetweenIslands(a: IslandLocationVector2, b: IslandLocationVector2) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];

    const distance = Math.sqrt(dx**2 + dy**2);
    return parseInt(distance.toFixed(0));
}

function createEncounterTable(): Encounters {
    const rawEventsToAdd = getRandomEvents();
    
    return { 1: {
        type: 'Disease',
        name: 'waa waa wee waa',
        severity: 2,
        weight: 3
    }}
    
}
function assignRoutes(islandFrom: Island): Route[] {
    const allOtherIslands = islands.filter(i => i.id !== islandFrom.id);

    const islandRoutes: Route[] = [];
    for (const [i, islandTo] of allOtherIslands.entries()) {
        const distance = computeDistanceBetweenIslands(islandFrom.location, islandTo.location);
        islandRoutes[i] = {
            to: islandTo.id,
            distanceKm: distance,
            encounterTable: createEncounterTable()
        };
    }
    return islandRoutes;
}

/** Add something like this later, don't have it as a property of Route */
// function computeTravelDays(distance: number, ship: Ship) {
    
// }

class WorldGraph {
    private _routesFrom: IslandRoutes;

    constructor() {
        this._routesFrom = assignAllRoutes();
    }
    get routesFrom() {
        return this._routesFrom;
    }
}

type Route = {
    to: number,
    distanceKm: number,
    encounterTable: Encounters
}

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
    printAvailableRoutes();
    await timeoutInSeconds(3);
    return 'At Island'
}

function printAvailableRoutes() {
    console.log('Available Routes:');
}

