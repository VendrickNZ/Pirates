import type { GameState } from "../types/GameState";
import { GameItems, type Inventory } from "../types/Item";
import { cleanInventory, Page, printInventoryStock } from "../types/Page";
import { printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type { Ship } from "./Ship";
import type { VendorSession } from "./Vendor";

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

    async sellItem(id: number, session: VendorSession) {
        const { player, vendor } = session;
        const itemRef = this.inventory.find(item => item.id === id);
        if (!itemRef) return false;

        const item = GameItems.find(x => x.id === itemRef.id);
        if (!item) return false;

        if (!(await player.canSell(item.baseValue, vendor))) return false;

        player.sellItem(itemRef);
        vendor.acquireItem(itemRef);
        cleanInventory(this);
        this.page.updateMaxPages(this.inventory);
        return true;
    }
}

export async function viewShipCargo(ship: Ship): Promise<GameState> {
    ship.viewCargo();
    await timeoutInSeconds(3);
    return 'At Island'
}