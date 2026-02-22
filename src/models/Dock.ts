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

export function getDocks(): Dock[] {
    return docks;
}

/** The starting dock of Port Royal */
export function getStartingDock(): Dock {
    const docks = getDocks()
    return docks.find(d => d.name == 'Port Royal')!;
}

export async function visitDocks(player: Player, rl: Interface): Promise<GameState> {
    printAvailableRoutes()
    await timeoutInSeconds(3);
    return 'At Island'
}

function printAvailableRoutes() {
    console.log('Available Routes:');
}
class WorldGraph {
    dockById: Record<number, Dock>;
    routesFrom: Record<number, Route[]>;

    constructor() {
        this.dockById = { 1: docks[0]}
        this.routesFrom = { 1: [{
            to: 2,
            distanceKm: 1,
            travelDays: 1,
            encounterTable: {
                1: 'Pirates',
                99: 'Lightning Strikes'
            }
        }]}
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