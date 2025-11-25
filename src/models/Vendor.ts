import type { Interface } from "readline/promises";
import { getStartingDock, type Dock } from "../types/Dock";
import type { GameState } from "../types/GameState";
import { constructReadline } from "../utils/ReadlineUtils";
import { formatCommand, isNumber, newLine, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import { PAGE_SIZE, paginate, printInventoryStock, printPageNumber, type Page } from "../types/Page";
import { getItems, type ItemList } from "../types/Item";


export class Vendor {
    private _balance: number;
    private _inventory: ItemList;
    private _location: Dock;
    private _page: Page;

    constructor() {
        this._balance = 200;
        this._inventory = restock()
        this._location = getStartingDock();
        this._page = {
            current: 0,
            max: this.calculateMaxPages(),
            size: PAGE_SIZE,
            items: [this._inventory]
        };
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

    get currentPageNumberIndex(): number {
        return this._page.current;
    }

    set currentPageNumberIndex(n: number) {
        if (n > this._page.max) {
            console.log('The script is not long enough yar');
            return;
        }

        if (n < 0) {
            console.log('The script cannae be off the map yar');
            return;
        }
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
        return Math.floor(this.inventory.length / PAGE_SIZE);
    }

    buyItem(id: number, player: Player) {
        const item = this._inventory.find(item => item.id == id);
        if (!item) return;
        if (!player.canPurchase(item.baseValue, item.weight)) return;
        
        player.purchaseItem(item.baseValue, item.weight);
        item.units--;
        this.cleanInventory();
    }

    cleanInventory() {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].units == 0) {
                this.inventory.splice(i, 1);
            }
        }
        paginate(this);
    }
}

/**
 * I am going to make this a lot more complex - or at least a bit more complex
 * Looks redundant currently, but it aligns more with what I want to do in short term future
 */
export function restock() {
    const items = getItems(50);
    return items;
}

export async function visitVendor(vendor: Vendor, player: Player): Promise<GameState> {
    printHeader(player);
    printInventoryStock(vendor);
    printPageNumber(vendor);
    printPlayerInstruction();

    const rl = constructReadline();
    let choice = await promptPlayer(rl, vendor, player);

    while (choice !== 'Return') {
        choice = await promptPlayer(rl, vendor, player);
    }

    await timeoutInSeconds(3);
    rl.close();
    return 'At Island';
}

async function promptPlayer(rl: Interface, vendor: Vendor, player: Player): Promise<VendorOptions> {
    const rawAnswer = await rl.question('');
    if (isNumber(rawAnswer)) {
        const playerNumber = parseInt(rawAnswer);
        const itemChosen = selectItem(playerNumber, vendor);
        vendor.buyItem(itemChosen.id, player);
        return playerAnswer(itemChosen.name, vendor, player); // call new func, return them to playerAnswer after stuff
    } else {
        const formattedAnswer = formatCommand(rawAnswer);
        return playerAnswer(formattedAnswer, vendor, player);
    }
}

function selectItem(number: number, vendor: Vendor) {
    const maxNumber = vendor.inventory.length;
    const minNumber = 0;
    const currentPage = vendor.currentPageNumberIndex;

    if (number > maxNumber || number < minNumber) {
        throw new Error('temp');
        //return -1;
    }

    const numberIndexInPage = (number - (currentPage * PAGE_SIZE) - 1)

    const chosenItem = vendor.pageItems[currentPage][numberIndexInPage];
    return chosenItem;
}

type VendorOptions = 'Next Page' | 'Previous Page' | 
    'Sell Cargo' | 'Return'

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
            return returnToMenu()
        }
        default: {
            console.log('Hit default switch');
            return returnToMenu();
        }

    }
}

function nextPage(player: Player, vendor: Vendor): VendorOptions {
    vendor.currentPageNumberIndex++;
    printAllVendorInformation(player, vendor);
    return 'Next Page'
}

function previousPage(player: Player, vendor: Vendor): VendorOptions {
    vendor.currentPageNumberIndex--;
    printAllVendorInformation(player, vendor);
    return 'Previous Page'
}

function sellCargo(player: Player, vendor: Vendor): VendorOptions {
    printAllSellCargoInformation(player)
    // call get all cargo items
    return 'Sell Cargo';
}

function returnToMenu(): VendorOptions {
    return 'Return'
}

function printAllSellCargoInformation(player: Player) {
    const isVendor = false;
    printHeader(player, isVendor);

    const cargo = player.ship.cargo;
    cargo.printCargoStatistics();
    printInventoryStock(cargo);
    printPageNumber(cargo);
    printPlayerInstruction2();

}
function printAllVendorInformation(player: Player, vendor: Vendor) {
    const isVendor = true;
    printHeader(player, isVendor);
    printInventoryStock(vendor);
    printPageNumber(vendor);
    printPlayerInstruction();
}


function printPlayerInstruction() {
    console.log("Type the number of the item you wish to buy, or type 'next page' or 'previous page' to see what else this vendor has.")
    console.log("If you wish to sell your cargo, type 'sell cargo'.")
    console.log("Type 'return' if you wish to go back.")
}

function printPlayerInstruction2() {
    console.log("Type the number of the item you wish to sell, or type 'next page' or 'previous page' to see what else this vendor has.")
    console.log("Type 'return' if you wish to go back.")
}

function printHeader(player: Player, isVendor?: boolean) {
    console.log(newLine(1))
    console.log(`Current balance: ${player.balance} Doubloons`)

    if (isVendor) {
        console.log(`===== ${player.dockedAt.name} Vendor Stock =====`)
        return;
    }

    console.log(`===== Selling Cargo at ${player.dockedAt.name} =====`);
}
