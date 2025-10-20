import { getStartingDock, type Dock } from "../types/Dock";
import type { GameState } from "../types/GameState";
import { getItems, type Item } from "../types/Item";
import { newLine, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";

type VendorStock = Item[]
type Page = {
    current: number;
    max: number;
    size: number;
    items: VendorStock[]
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
        this._page = {
            current: 1,
            max: this.calculateMaxPages(),
            size: PAGE_SIZE,
            items: [this._stock]
        };
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

    set pageItems(list: VendorStock[]) {
        this._page.items = list;
    }

    get pageItems() {
        return this._page.items;
    }

    getPage(pageNumber: number) {
        let page = this._page.items[pageNumber]
        if (page !== null) {
            return page;
        } else {
            throw new Error('womp womp');
        }
    }

    get pageSize() {
        return this._page.size;
    }

    calculateMaxPages() {
        return Math.floor(this.stock.length / PAGE_SIZE);
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
    paginate(vendor);
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


function printPageNumber(vendor: Vendor) {
    console.log(`===== Page ${vendor.currentPageNumber} of ${vendor.maxPageNumber} =====`)
}
function printVendorStock(vendor: Vendor) {
    const pageToDisplay = vendor.getPage(vendor.currentPageNumber);
    for (let i = 0; i < pageToDisplay.length; ++i) {
        const item = pageToDisplay[i]
        console.log(`${i + 1} - ${item.name} (${item.type}) x${item.units} ${stockFormatter(item, i + 1)} ${item.baseValue} Doubloons`);
    }
}

// pageList is a list of VendorStock
// VendorStock is a list of items
// items are basic js objects

/**
 * Looks like this
 * 
 * [
 *      [
 *          {
 *          },
 *          {
 *          }
 *      ]
 * ]
 * 
 */


function paginate(vendor: Vendor) {
    const stock = vendor.stock;
    const pageSize = vendor.pageSize;
    const pageList: VendorStock[] = [];
    let page: VendorStock = [];

    for (let i = 0; i < stock.length; ++i) {
        if (i % pageSize == 0) {
            pageList.push(page);
            page = [];
        }
        page.push(stock[i]);
    }
    vendor.pageItems = pageList;
}
function stockFormatter(stock: Item, index: number) {
    const spacing = 50;
    const itemVariableLength = stock.name.length + stock.type.length + stock.units.toString.length + index.toString().length;
    return '.'.repeat(spacing - itemVariableLength);
}