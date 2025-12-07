import type { GameState } from "../types/GameState";
import type { ItemReferenceList } from "../types/Item";
import { cleanInventory, PAGE_SIZE, printInventoryStock, type Page } from "../types/Page";
import { timeoutInSeconds } from "../utils/TextUtils";
import type { Ship } from "./Ship";

export default class Cargo {
    private _maxCapacity: number;
    private _currentCapacity: number;
    private _inventory: ItemReferenceList;
    private _page: Page;

    constructor(maxCapacity: number) {
        this._inventory = []
        this._maxCapacity = maxCapacity
        this._currentCapacity = 0
        this._page = {
            current: 0,
            max: this.calculateMaxPages(),
            size: PAGE_SIZE,
            items: [this._inventory]
        };
    }
    update() {
        cleanInventory(this);
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

    get currentPageNumberIndex(): number {
        return this._page.current;
    }

    set currentPageNumberIndex(n: number) {
        if (n > this._page.max) {
            console.log('The script is not long enough yar');
            return;
        }

        if (n < 1) {
            console.log('The script cannae be off the map yar');
            return;
        }
        console.log(`Went from ${this._page.current} to ${n}`);
        this._page.current = n;
    }

    get maxPageNumber(): number {
        return this._page.max;
    }

    set maxPageNumber(n: number) {
        this._page.max = n;
    }

    set pageItems(list: ItemReferenceList[]) {
        this._page.items = list;
    }

    get pageItems() {
        return this._page.items;
    }

    getPage(pageNumber: number) {
        let page = this._page.items[pageNumber]
        if (page) {
            return page;
        }
        throw new Error('womp womp');
    }

    get pageSize() {
        return this._page.size;
    }

    calculateMaxPages() {
        return Math.max(Math.ceil(this.inventory.length / PAGE_SIZE), 1);
    }

    printCargoStatistics() {
        this._inventory.length == 0 ?
            console.log('You have no cargo!') :
            printInventoryStock(this);
    }
}

export async function viewShipCargo(ship: Ship): Promise<GameState> {
    ship.viewCargo();
    await timeoutInSeconds(3);
    return 'At Island'
}