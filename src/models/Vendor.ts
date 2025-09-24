import type { GameState } from "../types/GameState";
import { GameItems, getItems, getItemsOfType, type Item } from "../types/Item";
import { timeoutInSeconds } from "../utils/TextUtils";

type VendorStock = Item[]

export class Vendor {
    private _balance: number;
    private _stock: VendorStock

    constructor() {
        this._balance = 200;
        this._stock = restock()
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

export async function visitVendor(vendor: Vendor): Promise<GameState> {
    console.log('Yarrrrrrr these are my not placeholder testing items on stock yarrrrrrrrr');
    printVendorStock(vendor);
    await timeoutInSeconds(3);
    return 'At Island';
}

function printVendorStock(vendor: Vendor) {
    const stock = vendor.stock;
    for (let i = 0; i < stock.length; ++i) {
        console.log(i+1, stock[i].name, (stock[i].type) + ':', stock[i].baseValue, 'Doubloons')
    }
}