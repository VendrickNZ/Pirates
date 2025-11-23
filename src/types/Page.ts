import type Cargo from "../models/Cargo";
import type { Vendor } from "../models/Vendor";
import type { Item, ItemList } from "./Item";

export const PAGE_SIZE = 10; 

export type Page = {
    current: number;
    max: number;
    size: number;
    items: ItemList[]
}

type PageOwner = Vendor | Cargo;
export function paginate(pageOwner: PageOwner) {
    const inventory = pageOwner.inventory;
    const pageSize = pageOwner.pageSize;
    const pageList: ItemList[] = [];
    let page: ItemList = [];

    page.push(inventory[0]);
    for (let i = 1; i < inventory.length; ++i) {
        if (i % pageSize == 0) {
            pageList.push(page);
            page = [];
        }
        page.push(inventory[i]);
    }
    if (inventory.length % pageSize != 0) pageList.push(page);
    pageOwner.pageItems = pageList;
}

export function printPageNumber(pageOwner: PageOwner) {
    console.log(`===== Page ${pageOwner.currentPageNumberIndex + 1} of ${pageOwner.maxPageNumber + 1} =====`)
}

export function printInventoryStock(pageOwner: PageOwner) {
    const pageToDisplay = pageOwner.getPage(pageOwner.currentPageNumberIndex);
    const pageNumberIndexShift = (pageOwner.currentPageNumberIndex) * 10
    for (let i = 0; i < pageToDisplay.length; ++i) {
        const item = pageToDisplay[i]
        const itemIndex = i + 1 + pageNumberIndexShift;
        console.log(`${itemIndex} - ${item.name} (${item.type}) x${item.units} ${inventoryFormatter(item, i + 1)} ${item.baseValue} Doubloons`);
    }
}

export function inventoryFormatter(inventory: Item, index: number) {
    const spacing = 50;
    const itemVariableLength = inventory.name.length + inventory.type.length + inventory.units.toString.length + index.toString().length;
    return '.'.repeat(spacing - itemVariableLength);
}
