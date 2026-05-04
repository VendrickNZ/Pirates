import type Cargo from "../models/Cargo";
import { recomputePrices } from "../models/Market";
import type Player from "../models/Player";
import { type Vendor } from "../models/Vendor";
import { formatFloat, printInformation } from "../utils/TextUtils";
import { ItemLookup, type ItemReference, type Inventory } from "./Item";

export const PAGE_SIZE = 10;

export type PageOwner = Vendor | Cargo;
export type PageCommand = 'Next Page' | 'Previous Page' | 'Return'
export type ContinuePrompting = 'Continue'

export class Page {
    current: number;
    max: number;
    size: number;
    items: Inventory[]

    constructor(inventory: Inventory) {
        this.current = 0;
        this.max = this.calculateMaxPages(inventory);
        this.size = PAGE_SIZE;
        this.items = [inventory];
    }

    get currentPageNumberIndex(): number {
        return this.current;
    }

    set currentPageNumberIndex(n: number) {
        if (n > this.max) {
            printInformation('The script is not long enough yar');
            return;
        }

        if (n < 0) {
            printInformation('The script cannae be off the map yar');
            return;
        }
        this.current = n;
    }

    get maxPageNumber(): number {
        return this.max;
    }

    set maxPageNumber(n: number) {
        this.max = n;
    }

    set pageItems(list: Inventory[]) {
        this.items = list;
    }

    get pageItems() {
        return this.items;
    }

    getPage(pageNumber: number, inventory: Inventory) {
        const page = this.items[pageNumber];
        if (page) {
            return page;
        }

        if (inventory.length === 0) {
            return null;
        }
        throw new Error(`Page ${pageNumber} not found.`);
    }

    get pageSize() {
        return this.size;
    }

    calculateMaxPages(inventory: Inventory) {
        if (inventory.length === 0) return 0;
        return Math.floor((inventory.length - 1) / PAGE_SIZE);
    }

    updateMaxPages(inventory: Inventory) {
        this.max = this.calculateMaxPages(inventory);
        if (this.current > this.max) {
            this.current = this.max;
        }
    }

    nextPage() {
        this.currentPageNumberIndex++;
    }

    previousPage() {
        this.currentPageNumberIndex--;
    }
}

export function paginate(pageOwner: PageOwner) {
    const inventory = pageOwner.inventory;
    const pageSize = pageOwner.page.pageSize;
    const pageList: Inventory[] = [];
    let page: Inventory = [];

    for (let i = 0; i < inventory.length; i++) {
        const reference = { id: inventory[i].id, units: inventory[i].units, currentValue: inventory[i].currentValue }
        page.push(reference);

        if (page.length === pageSize) {
            pageList.push(page);
            page = [];
        }
    }

    if (page.length > 0) {
        pageList.push(page);
    }

    pageOwner.page.pageItems = pageList;
}

export function printPageNumber(pageOwner: PageOwner) {
    console.log(`===== Page ${pageOwner.page.currentPageNumberIndex + 1} of ${pageOwner.page.maxPageNumber + 1} =====`)
}

export function printInventoryStock(pageOwner: PageOwner) {
    const pageToDisplay = pageOwner.page.getPage(pageOwner.page.currentPageNumberIndex, pageOwner.inventory);

    if (pageToDisplay === null) {
        pageOwner.printEmptyInventoryMessage();
        return;
    }

    const pageNumberIndexShift = (pageOwner.page.currentPageNumberIndex) * 10;
    for (let i = 0; i < pageToDisplay.length; ++i) {
        const itemRef = pageToDisplay[i]

        const item = ItemLookup.get(itemRef.id);
        if (!item) continue;

        const itemIndex = i + 1 + pageNumberIndexShift;
        console.log(`${itemIndex} - ${item.name} (${item.type}) x${itemRef.units} ${inventoryFormatter(itemRef, i + 1)} ${itemRef.currentValue} Doubloons`);
    }
}

export function inventoryFormatter(itemRef: ItemReference, index: number) {
    const item = ItemLookup.get(itemRef.id)!;
    const spacing = 50;
    const itemVariableLength = item.name.length + item.type.length + itemRef.units.toString().length + index.toString().length;
    return '.'.repeat(spacing - itemVariableLength);
}


export function cleanInventory(pageOwner: PageOwner) {
    const inventory = pageOwner.inventory;
    for (let i = inventory.length - 1; i >= 0; i--) {
        if (inventory[i].units == 0) {
            inventory.splice(i, 1);
        }
    }
    paginate(pageOwner);
}

/** maybe make this page owner? */
export function updateInventoryPrices(vendor: Vendor, player: Player) {
    for (const itemReference of vendor.inventory) {
        const item = ItemLookup.get(itemReference.id);
        itemReference.currentValue = formatFloat(recomputePrices(item!, vendor.commodities, player), 1);
    }
}