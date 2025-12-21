import type { GameState } from "../types/GameState";
import type { Inventory } from "../types/Item";
import { cleanInventory, Page, printInventoryStock } from "../types/Page";
import { printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type { Ship } from "./Ship";

export default class Cargo {
    private _maxCapacity: number;
    private _currentCapacity: number;
    private _inventory: Inventory;
    private _page: Page;

    constructor(maxCapacity: number) {
        this._inventory = []
        this._maxCapacity = maxCapacity
        this._currentCapacity = 0
        this._page = new Page(this.inventory)
        this.update();
    }
    update() {
        cleanInventory(this);
        this._page.max = this._page.calculateMaxPages(this.inventory);
    }

    get inventory() {
        return this._inventory;
    }

    get maxCapacity() {
        return this._maxCapacity;
    }

    set currentCapacity(capacityToAdd: number) {
        this._currentCapacity += capacityToAdd;
    }

    get currentCapacity(): number {
        return this._currentCapacity
    }

    get page() {
        return this._page;
    }

    printCargoStatistics() {
        this._inventory.length == 0 ?
            console.log('You have no cargo!') :
            printInventoryStock(this);
    }

    printEmptyInventoryMessage() {
        printInformation('Ye cargo is empty!');
    }
}

export async function viewShipCargo(ship: Ship): Promise<GameState> {
    ship.viewCargo();
    await timeoutInSeconds(3);
    return 'At Island'
}