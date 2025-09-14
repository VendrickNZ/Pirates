import type { GameState } from "../types/GameState";
import { printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type { Ship } from "./Ship";

export default class Cargo {
    private _count: number;
    private _maxCapacity: number;

    constructor() {
        this._count = 0;
        this._maxCapacity = 0 // ship.maxCapacity
    }

    get count() {
        return this._count;
    }

    get maxCapacity() {
        return this._maxCapacity;
    }

    printCargoStatistics(): string {
        if (this._count == 0) return 'You have no cargo!';

        return [
            `Will add this shortly`,
        ].join('\n');
    }
}

export async function viewShipCargo(ship: Ship): Promise<GameState> {
    printInformation(ship.viewCargo())
    await timeoutInSeconds(3);
    return 'At Island'
}