import type { Interface } from "readline/promises";
import { getStartingDock, type Dock } from "../types/Dock";
import type { GameState } from "../types/GameState";
import { formatCommand, isNumber, newLine, printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import { cleanInventory, Page, PAGE_SIZE, paginate, printInventoryStock, printPageNumber } from "../types/Page";
import { GameItems, type Item, type Inventory, getItems } from "../types/Item";

type VendorOptions = 'Next Page' | 'Previous Page' | 'Sell Cargo' | 'Return' | 'Continue';

export class Vendor {
    private _balance: number;
    private _inventory: Inventory;
    private _location: Dock;
    private _page: Page;

    constructor() {
        this._balance = 200;
        this._inventory = restock();
        this._location = getStartingDock();
        this._page = new Page(this.inventory)
        paginate(this);
    }

    get balance() {
        return this._balance;
    }

    get inventory() {
        return this._inventory;
    }

    get location() {
        return this._location; 
    }

    get page() {
        return this._page;
    }

    async buyItem(id: number, player: Player) {
        const itemRef = this._inventory.find(item => item.id === id);
        if (!itemRef) return false;
        
        const item = GameItems.find(x => x.id === itemRef.id);
        if (!item) return false;
        
        if (!(await player.canPurchase(item.baseValue, item.weight))) return false;
        
        player.purchaseItem(itemRef);
        cleanInventory(this);
        this._page.updateMaxPages(this._inventory);

        return true;
    }

    printEmptyInventoryMessage() {
        printInformation('Ye ave plundered the vendor!');
    }
}

/**
 * I am going to make this a lot more complex - or at least a bit more complex
 * Looks redundant currently, but it aligns more with what I want to do in short term future
 */
export function restock() {
    const items = getItems(15);
    return items;
}

export async function visitVendor(vendor: Vendor, player: Player, rl: Interface): Promise<GameState> {
    const isVendor = true;

    vendor.page.currentPageNumberIndex = 0;
    paginate(vendor);
    vendor.page.maxPageNumber = vendor.page.calculateMaxPages(vendor.inventory);

    printHeader(player, isVendor);
    printInventoryStock(vendor);
    printPageNumber(vendor);
    printPlayerAtVendorInstructions();

    let choice = await promptPlayer(rl, vendor, player);

    while (choice !== 'Return') {
        choice = await promptPlayer(rl, vendor, player);
    }

    await timeoutInSeconds(1);
    return 'At Island';
}

async function promptPlayer(rl: Interface, vendor: Vendor, player: Player): Promise<VendorOptions> {
    const rawAnswer = await rl.question('');

    if (isNumber(rawAnswer)) {
        const playerNumber = parseInt(rawAnswer);
        const itemReferenceChosen = selectItem(playerNumber, vendor);

        if (itemReferenceChosen === -1) {
            printAllVendorInformation(player, vendor);
            printPlayerAtVendorInstructions();
            return 'Continue';
        }

        const item = GameItems.find(x => x.id === itemReferenceChosen.id);
        if (!item) {
            printAllVendorInformation(player, vendor);
            printPlayerAtVendorInstructions();
            return 'Continue';
        }

        const isSuccessfulPurchase = await vendor.buyItem(itemReferenceChosen.id, player);
        if (isSuccessfulPurchase) {
            purchaseItem(item);
        }
        printAllVendorInformation(player, vendor);
        printPlayerAtVendorInstructions();
        return 'Continue';
    }

    const formattedAnswer = formatCommand(rawAnswer);
    return playerAnswer(formattedAnswer, vendor, player);
}

function purchaseItem(item: Item): VendorOptions {
    console.log(`Ye purchased ${item.name} for ${item.baseValue} Doubloons!`);
    return 'Continue';
}

function selectItem(number: number, vendor: Vendor) {
    const currentPage = vendor.page.currentPageNumberIndex;
    const page = vendor.page.pageItems[currentPage];

    if (!page || page.length === 0) {
        console.log('Thar be no cargo on this page, yarrr');
        return -1;
    }

    const startIndex = currentPage * PAGE_SIZE + 1;
    const endIndex = startIndex + page.length - 1;

    if (number < startIndex || number > endIndex) {
        console.log('yer number is out of bounds, yarrr');
        return -1;
    }

    const numberIndexInPage = number - startIndex;
    return page[numberIndexInPage];
}

function playerAnswer(answer: string, vendor: Vendor, player: Player): VendorOptions {
    switch (answer) {
        case 'Next Page': {
            return nextPage(player, vendor);
        }
        case 'Previous Page': {
            return previousPage(player, vendor);
        }
        case 'Sell Cargo': {
            return sellCargo(player, vendor);
        }
        case 'Return': {
            return returnToMenu();
        }
        default: {
            return returnToMenu();
        }
    }
}

function nextPage(player: Player, vendor: Vendor): VendorOptions {
    vendor.page.currentPageNumberIndex++;
    printAllVendorInformation(player, vendor);
    printPlayerAtVendorInstructions();
    return 'Next Page';
}

function previousPage(player: Player, vendor: Vendor): VendorOptions {
    vendor.page.currentPageNumberIndex--;
    printAllVendorInformation(player, vendor);
    printPlayerAtVendorInstructions();
    return 'Previous Page';
}

function sellCargo(player: Player, vendor: Vendor): VendorOptions {
    printAllSellCargoInformation(player);
    printPlayerSellingCargoInstructions();

    // call get all cargo items
    return 'Sell Cargo';
}

function returnToMenu(): VendorOptions {
    return 'Return';
}

function printAllSellCargoInformation(player: Player) {
    const isVendor = false;
    printHeader(player, isVendor);

    const cargo = player.ship.cargo;
    printInventoryStock(cargo);
    printPageNumber(cargo);
}

function printAllVendorInformation(player: Player, vendor: Vendor) {
    const isVendor = true;
    printHeader(player, isVendor);
    printInventoryStock(vendor);
    printPageNumber(vendor);
}

function printPlayerAtVendorInstructions() {
    console.log("Type the number of the item you wish to buy, or type 'next page' or 'previous page' to see what else this vendor has.");
    console.log("If you wish to sell your cargo, type 'sell cargo'.");
    console.log("Type 'return' if you wish to go back.");
}

// need to put my logs into some instruction builder at some point
function printPlayerSellingCargoInstructions() {
    console.log("Type the number of the item you wish to sell, or type 'next page' or 'previous page' to see what other items you have.")
    console.log("Type 'return' if you wish to go back.");
}

function printHeader(player: Player, isVendor?: boolean) {
    console.log(newLine(1));
    console.log(`Current balance: ${player.balance.toFixed(1)} Doubloons`);

    if (isVendor) {
        console.log(`===== ${player.dockedAt.name} Vendor Stock =====`);
        return;
    }

    console.log(`===== Selling Cargo at ${player.dockedAt.name} =====`);
}
