import { getStartingDock, type Dock } from "../types/Dock";
import type { GameState } from "../types/GameState";
import { getItems, type Item } from "../types/Item";
import { newLine, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";

type VendorStock = Item[]
type Page = {
    current: number;
    max: number;
}

const PAGE_SIZE = 10;

export class Vendor {
    private _balance: number;
    private _stock: VendorStock;
    private _location: Dock;
    private _page: Page;

    constructor() {
        this._balance = 200;
        this._stock = restock()
        this._location = getStartingDock();
        this._page = { current: 1, max: 1 };
    }

    get balance() {
        return this._balance;
    }

    get stock() {
        return this._stock;
    }

    get location() {
        return this._location;
    }

    get currentPageNumber(): number {
        return this._page.current;
    }

    set currentPageNumber(n: number) {
        this._page.current = n;
    }

    get maxPageNumber(): number {
        return this._page.max;
    }

    set maxPageNumber(n: number) {
        this._page.max = n;
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
    printVendorHeader(player);
    printVendorStock(vendor);
    printPageNumber(vendor);
    await timeoutInSeconds(3);
    return 'At Island';
}

function printVendorHeader(player: Player) {
    console.log(newLine(1))
    console.log(`Current balance: ${player.balance} Doubloons`)
    console.log(`===== ${player.dockedAt.name} Vendor Stock =====`)
}

function calculateMaxPages(vendor: Vendor) {
    vendor.maxPageNumber = Math.floor(vendor.stock.length / PAGE_SIZE);
}
function printPageNumber(vendor: Vendor) {
    calculateMaxPages(vendor);
    console.log(`===== Page ${vendor.currentPageNumber} of ${vendor.maxPageNumber} =====`)
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