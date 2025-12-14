import type Cargo from "../models/Cargo";
import type { Vendor } from "../models/Vendor";
import { printInformation } from "../utils/TextUtils";
import { GameItems, type ItemReference, type ItemReferenceList } from "./Item";

export const PAGE_SIZE = 10; 

export type Page = {
    current: number;
    max: number;
    size: number;
    items: ItemReferenceList[]
}

type PageOwner = Vendor | Cargo;

export function paginate(pageOwner: PageOwner) {
    const inventory = pageOwner.inventory;
    const pageSize = pageOwner.pageSize;
    const pageList: ItemReferenceList[] = [];
    let page: ItemReferenceList = [];

    for (let i = 0; i < inventory.length; i++) {
        const reference = { id: inventory[i].id, units: inventory[i].units }
        page.push(reference);

        if (page.length === pageSize) {
            pageList.push(page);
            page = [];
        }
    }

    if (page.length > 0) {
        pageList.push(page);
    }

    pageOwner.pageItems = pageList;
}

export function printPageNumber(pageOwner: PageOwner) {
    console.log(`===== Page ${pageOwner.currentPageNumberIndex + 1} of ${pageOwner.maxPageNumber + 1} =====`)
}

export function printInventoryStock(pageOwner: PageOwner) {
    const pageToDisplay = pageOwner.getPage(pageOwner.currentPageNumberIndex);

    if (pageToDisplay === null) {
        pageOwner.printEmptyInventoryMessage();
        return;
    }

    const pageNumberIndexShift = (pageOwner.currentPageNumberIndex) * 10;
    for (let i = 0; i < pageToDisplay.length; ++i) {
        const itemRef = pageToDisplay[i]

        const item = GameItems.find(x => x.id === itemRef.id);
        if (!item) continue;

        const itemIndex = i + 1 + pageNumberIndexShift;
        console.log(`${itemIndex} - ${item.name} (${item.type}) x${itemRef.units} ${inventoryFormatter(itemRef, i + 1)} ${item.baseValue} Doubloons`);
    }
}

export function inventoryFormatter(itemRef: ItemReference, index: number) {
    const item = GameItems.find(x => x.id == itemRef.id)!;
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