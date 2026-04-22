import type { Interface } from "readline/promises";
import type { GameState } from "../types/GameState";
import { formatCommand, formatFloat, isNumber, printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import { getRandomEvents, type EncounterTable } from "../types/EncounterTable";
import { getIslands } from "./Island";
import type { IslandId, Island, IslandLocationVector2 } from "./Island";
import type { Ship } from "./Ship";

const HOURS_IN_DAY = 24;

/** 1 knot = 1.852km/h */
const KNOTS_TO_KM_PER_DAY_CONVERSION = (knots: number) => knots * (1.852 * HOURS_IN_DAY);

type Route = {
    destinationIslandId: IslandId,
    distanceKm: number,
    encounterTable: EncounterTable
}
type IslandRoutes = Record<IslandId, Route[]>;

type RouteSelection =
    | { kind: 'selected'; routeIndex: number }
    | { kind: 'back'; }

function assignAllRoutes(): IslandRoutes {
    const islands = getIslands();
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
    const allOtherIslands = getIslands().filter(i => i.id !== islandFrom.id);

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

export class WorldGraph {
    private _allRoutes: IslandRoutes;

    constructor() {
        this._allRoutes = assignAllRoutes();
    }

    get allRoutes() {
        return this._allRoutes;
    }

    getRoutesFor(islandId: IslandId) {
        return this.allRoutes[islandId];
    }
}

export async function visitDocks(player: Player, rl: Interface, worldGraph: WorldGraph): Promise<GameState> {
    printAvailableRoutes(worldGraph, player);
    const selectedOption = await promptPlayerForRoute(rl);

    if (selectedOption.kind === 'back') {
        await timeoutInSeconds(2);
        return 'At Island'
    }

    travelToIsland(selectedOption.routeIndex, player);
    await timeoutInSeconds(2);
    return 'At Island'
}

function printAvailableRoutes(graph: WorldGraph, player: Player) {
    printInformation('Available Routes:', 0);

    const availableRoutes = graph.getRoutesFor(player.island.id);
    for (const [i, route] of availableRoutes.entries()) {
        const island = getIslands().find(i => i.id === route.destinationIslandId)!;
        printIslandRouteTitle(i, island.name, route.distanceKm, player.ship);
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
    Object.entries(island.commodityMultipliers).forEach(([itemType, value]) => {
        console.log(`${itemType}: ${value}`);
    })
}

async function promptPlayerForRoute(rl: Interface): Promise<RouteSelection> {
    const islands = getIslands();
    const numberOfRoutes = islands.length - 1;
    while (true) {
        console.log(`Select a route (1-${numberOfRoutes}) or exit`);

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

function travelToIsland(selectedRoute: number, player: Player) {
    const nonPlayerIslands = getIslands().filter(x => x.id !== player.island.id);
    const islandToTravelTo = nonPlayerIslands[selectedRoute - 1];

    player.island = islandToTravelTo;
}
