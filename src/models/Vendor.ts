import { getStartingDock, type Dock } from "../types/Dock";
import type { GameState } from "../types/GameState";
import { getItems, type Item } from "../types/Item";
import { timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";

type VendorStock = Item[]

export class Vendor {
    private _balance: number;
    private _stock: VendorStock;
    private _location: Dock;

    constructor() {
        this._balance = 200;
        this._stock = restock()
        this._location = getStartingDock();
    }

    get balance() {
        return this._balance;
    }

    get stock() {
        return this._stock;
    }
}

/** I am going to make this a lot more complex - or at least a bit more complex
 * Looks redundant currently, but it aligns more with what I want to do in short term future
 */
export function restock() {
    const items = getItems(50);
    return items;
}

export async function visitVendor(vendor: Vendor, player: Player): Promise<GameState> {
    printVendorStock(vendor);
    await timeoutInSeconds(3);
    return 'At Island';
}

function printVendorHeader(vendor: Vendor) {

}

function printVendorStock(vendor: Vendor) {
    const stock = vendor.stock;
    for (let i = 0; i < stock.length; ++i) {
        console.log(`${i+1} - ${stock[i].name} (${stock[i].type}) x${stock[i].units} ${stockFormatter(stock[i], i+1)} ${stock[i].baseValue} Doubloons`);
    }
}

function stockFormatter(stock: Item, index: number){
    const spacing = 50;
    const itemVariableLength = stock.name.length + stock.type.length + stock.units.toString.length + index.toString().length;
    return '.'.repeat(spacing - itemVariableLength);
}