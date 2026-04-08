import type { Interface } from "readline/promises";
import type { GameState } from "../types/GameState";
import { formatCommand, formatFloat, isNumber, printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import type { ItemType } from "../types/Item";
import { getRandomEvents, type EncounterTable } from "../types/EncounterTable";
import { getRandomInt } from "../utils/NumberUtils";
import type { Ship } from "./Ship";
import { Vendor } from "./Vendor";

const MAX_COORDINATE = 1000;
const MIN_COORDINATE = -1000;

const HOURS_IN_DAY = 24;

/** 1 knot = 1.852km/h */
const KNOTS_TO_KM_PER_DAY_CONVERSION = (knots: number) => knots * (1.852 * HOURS_IN_DAY);

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
    id: IslandId;

    name: IslandNames;

    /** What modifiers to apply to item types */
    commodities: IslandCommoditiesTable;

    /** Coordinates for XY position on world map */
    location: IslandLocationVector2;

    /** The given Islands vendor */
    vendor: Vendor;
}

type RouteSelection =
    | { kind: 'selected'; routeIndex: number }
    | { kind: 'back'; }

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
        location: generateLocation(),
        vendor: new Vendor()
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
        location: generateLocation(),
        vendor: new Vendor()
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
        location: generateLocation(),
        vendor: new Vendor()
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
        location: generateLocation(),
        vendor: new Vendor()
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
    printAvailableRoutes(x, player.ship);
    const selectedOption = await promptPlayerForRoute(rl);

    if (selectedOption.kind === 'back') {
        await timeoutInSeconds(2);
        return 'At Island'
    }


    await travelToIsland(selectedOption.routeIndex, player, rl);
    await timeoutInSeconds(2);
    return 'At Island'
}

function printAvailableRoutes(graph: WorldGraph, playerShip: Ship) {
    printInformation('Available Routes:', 0);

    const availableRoutes = graph.currentIslandRoutes;
    for (const [i, route] of availableRoutes.entries()) {
        const island = getIslands().find(i => i.id === route.destinationIslandId)!;
        printIslandRouteTitle(i, island.name, route.distanceKm, playerShip);
        printIslandRouteInformation(route.encounterTable, island);
        printIslandRouteItemModifiers(island);
        printInformation('---', 0)
    }
}

function printIslandRouteInformation(encounterTable: EncounterTable, island: Island) {
    const totalWeight = encounterTable.reduce((acc, currItem) => acc + currItem.weight, 0);

    console.log(`There is a ${formatFloat(totalWeight, 0)}% chance of encountering one of the following hazards while travelling to ${island.name}:`);

    for (const event of encounterTable) {
        console.log(`\t- ${event.name} (${event.weight}%)`);
    }
}

function computeTravelDays(distance: number, playerShip: Ship) {
    const shipSpeed = playerShip.speed;
    const distancePerDay = KNOTS_TO_KM_PER_DAY_CONVERSION(shipSpeed);
    return formatFloat(distance / distancePerDay, 0);
}

function printIslandRouteTitle(index: number, name: string, distance: number, playerShip: Ship) {
    const travelDays = computeTravelDays(distance, playerShip);
    console.log(`[${index+1}] ${name} (${distance} km, ${travelDays} days)`);
}

function printIslandRouteItemModifiers(island: Island) {
    for (const commodity of island.commodities) {
        Object.entries(commodity).forEach(([itemType, value]) => {
            console.log(`${itemType}: ${value}`);
        })
    }
}

async function promptPlayerForRoute(rl: Interface): Promise<RouteSelection> {
    const numberOfRoutes = islands.length - 1;
    while (true) {
        console.log(`Select a route (1-${numberOfRoutes})`);

        const rawAnswer = await rl.question('');

        if (formatCommand(rawAnswer) === 'Exit') {
            return { kind: 'back' }
        }
        if (isValidRoute(rawAnswer, numberOfRoutes)) {
            return { kind: 'selected', routeIndex: parseInt(rawAnswer) };
        }
    }
}

function isValidRoute(rawAnswer: string, numberOfRoutes: number) {
    if (!isNumber(rawAnswer)) return false;
    const convertedAnswer = parseInt(rawAnswer);
    if (convertedAnswer <= 0 || convertedAnswer > numberOfRoutes) return false;
    return true;
}

function travelToIsland(selectedRoute: number, player: Player, rl: Interface) {
    const nonPlayerIslands = islands.filter(x => x.id !== player.island.id);
    const islandToTravelTo = nonPlayerIslands[selectedRoute - 1];

    player.island = islandToTravelTo;
}