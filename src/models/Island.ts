import type { Interface } from "readline";
import type { GameState } from "../types/GameState";
import { timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import type { ItemType } from "../types/Item";

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
    const x = Math.random() * (MAX_COORDINATE - MIN_COORDINATE) + MIN_COORDINATE;
    const y = Math.random() * (MAX_COORDINATE - MIN_COORDINATE) + MIN_COORDINATE;

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

function assignRoutes(islandFrom: Island): Route[] {
    const allOtherIslands = islands.filter(i => i.id !== islandFrom.id);

    const islandRoutes: Route[] = [];
    for (const [i, islandTo] of allOtherIslands.entries()) {
        islandRoutes[i] = {
            to: islandTo.id,
            distanceKm: computeDistanceBetweenIslands(islandFrom.location, islandTo.location),
            travelDays: 2,
            encounterTable: {}
        }
    }
    return islandRoutes;
}

class WorldGraph {
    private _routesFrom: IslandRoutes;

    constructor() {
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
        this._routesFrom = assignAllRoutes()
    }
    get routesFrom() {
        console.log('I am in the routesFrom getter');
        return this._routesFrom;
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
    console.log(x.routesFrom);
    printAvailableRoutes();
    await timeoutInSeconds(3);
    return 'At Island'
}

function printAvailableRoutes() {
    console.log('Available Routes:');
}

