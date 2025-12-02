import type { GameState } from "../types/GameState";
import type { ItemList } from "../types/Item";
import { PAGE_SIZE, type Page } from "../types/Page";
import { printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type { Ship } from "./Ship";

export default class Cargo {
    private _count: number;
    private _maxCapacity: number;
    private _inventory: ItemList;
    private _page: Page;

    constructor() {
        this._count = 0;
        this._inventory = []
        this._maxCapacity = 0 // ship.maxCapacity
        this._page = {
            current: 1,
            max: this.calculateMaxPages(),
            size: PAGE_SIZE,
            items: [this._inventory]
        };
    }

    get inventory() {
        return this._inventory;
    }

    get count() {
        return this._count;
    }

    get maxCapacity() {
        return this._maxCapacity;
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

    set pageItems(list: ItemList[]) {
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

    set count(toAdd: number) {
        this._count += toAdd;
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