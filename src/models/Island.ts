import type { Interface } from "readline";
import type { GameState } from "../types/GameState";
import { formatFloat, newLine, printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import type { ItemType } from "../types/Item";
import { getRandomEvents, type EncounterTable } from "../types/EncounterTable";
import { getRandomInt } from "../utils/NumberUtils";
import { test } from "node:test";

const MAX_COORDINATE = 1000;
const MIN_COORDINATE = -1000;

type IslandNames = 'Barataria Bay' | 'Port Royal' | 'Tortuga' | 'Prince Edward Island'
type IslandCommoditiesTable = Record<ItemType, number>[];
type IslandLocationVector2 = [number, number];


type IslandId = number;
type Route = {
    destinationIslandId: IslandId,
    distanceKm: number,
    encounterTable: EncounterTable
}
type IslandRoutes = Record<IslandId, Route[]>;

export type Island = {
    id: IslandId,

    name: IslandNames,

    /** What modifiers to apply to item types */
    commodities: IslandCommoditiesTable,

    /** Coordinates for XY position on world map */
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

function createEncounterTable(): EncounterTable {
    const events = getRandomEvents();
    let encounterTable: EncounterTable = [];
    for (const event of events) {
        encounterTable.push(event);
    }
    
    return encounterTable;
    
}
function assignRoutes(islandFrom: Island): Route[] {
    const allOtherIslands = islands.filter(i => i.id !== islandFrom.id);

    const islandRoutes: Route[] = [];
    for (const [i, islandTo] of allOtherIslands.entries()) {
        const distance = computeDistanceBetweenIslands(islandFrom.location, islandTo.location);
        islandRoutes[i] = {
            destinationIslandId: islandTo.id,
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
    private _currentIsland: Island;
    private _allRoutes: IslandRoutes;

    constructor() {
        this._allRoutes = assignAllRoutes();
        this._currentIsland = getStartingIsland();
    }

    get allRoutes() {
        return this._allRoutes;
    }

    get currentIsland() {
        return this._currentIsland;
    }

    get currentIslandRoutes() {
        return this.allRoutes[this.currentIsland.id];
    }
}
export function getIslands(): Island[] {
    return islands;
}

/** The starting island of Port Royal */
export function getStartingIsland(): Island {
    const islands = getIslands();
    return islands.find(d => d.name === 'Port Royal')!;
}

export async function visitDocks(player: Player, rl: Interface): Promise<GameState> {
    const x = new WorldGraph();
    printAvailableRoutes(x);
    await timeoutInSeconds(3);
    return 'At Island'
}

function printAvailableRoutes(graph: WorldGraph) {
    printInformation('Available Routes:', 1);

    const availableRoutes = graph.currentIslandRoutes;
    for (const [i, route] of availableRoutes.entries()) {
        const island = getIslands().find(i => i.id === route.destinationIslandId)!;
        console.log(`[${i+1}] ${island.name} (${route.distanceKm} km)`);
        formatEncounterTable(route.encounterTable)
    }
}

function formatEncounterTable(encounterTable: EncounterTable) {
    const totalWeight = encounterTable.reduce((acc, currItem) => acc + currItem.weight, 0);
    const remainderWeight = 100 - totalWeight;

    console.log(`There is a ${formatFloat(remainderWeight, 0)}% chance of encountering one of the following hazards while travelling to x island`);

    for (const event of encounterTable) {
        console.log(`\t- ${event.name} (${event.weight}%)`);
    }

    newLine(1);
}