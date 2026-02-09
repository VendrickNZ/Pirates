import type { Interface } from "readline/promises";
import { getStartingDock, type Dock } from "../types/Dock";
import type { GameState } from "../types/GameState";
import { formatCommand, isNumber, newLine, printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import { cleanInventory, Page, paginate, printInventoryStock, printPageNumber } from "../types/Page";
import { GameItems, type Item, type Inventory, getItems, type ItemReference } from "../types/Item";
import { VendorContext } from "../contexts/VendorContext";
import { BuyStrategy, SellStrategy } from "../contexts/VendorStrategy";


export type VendorOptions = 'Next Page' | 'Previous Page' | 'Sell Cargo' | 'Return' | 'Continue';
export type VendorSession = {
    vendor: Vendor,
    player: Player
}

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

    /** Checks if the Player can purchase item, if so, purchases it. */
    async buyItem(id: number, player: Player) {
        const itemRef = this.inventory.find(item => item.id === id);
        if (!itemRef) return false;

        const item = GameItems.find(x => x.id === itemRef.id);
        if (!item) return false;
        
        if (!(await player.canPurchase(item.baseValue, item.weight))) return false;
        
        player.purchaseItem(itemRef);
        cleanInventory(this);
        const cargo = player.ship.cargo;
        this.page.updateMaxPages(this.inventory);
        cargo.page.updateMaxPages(cargo.inventory)
        return true;
    }

    /** Adds an item if it doesn't exist, else increments units, and cleans inventory */
    acquireItem(itemRef: ItemReference) {
        const existingItem = this.inventory.find(x => x.id == itemRef.id);
        if (existingItem) {
            existingItem.units++;
        } else {
            const newItem: ItemReference = { id: itemRef.id, units: 1 };
            this.inventory.push(newItem);
        }

        cleanInventory(this);
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

function setupInitialVendorPages(vendor: Vendor) {
    vendor.page.currentPageNumberIndex = 0;
    paginate(vendor);
    vendor.page.maxPageNumber = vendor.page.calculateMaxPages(vendor.inventory);
}

export async function visitVendor(vendor: Vendor, player: Player, rl: Interface): Promise<GameState> {
    const session: VendorSession = { vendor, player };
    const vendorContext = new VendorContext(new BuyStrategy());
    setupInitialVendorPages(vendor);
    vendorContext.printAllPlayerInstructions(session);

    let choice;
    while (choice !== 'Return') {
        choice = await promptPlayer(rl, session, vendorContext);
    }

    await timeoutInSeconds(1);
    return 'At Island';
}

async function promptPlayer(rl: Interface, session: VendorSession, ctx: VendorContext): Promise<VendorOptions> {
    const rawAnswer = await rl.question('');

    if (isNumber(rawAnswer)) {
        return executeItemSelection(rawAnswer, session, ctx)
    }

    return executeCommandSelection(rawAnswer, session, ctx);
}

async function executeItemSelection(rawAnswer: string, session: VendorSession, ctx: VendorContext): Promise<VendorOptions> {
    const itemRef = hasSelectedValidItem(rawAnswer, session, ctx);
    if (!itemRef) {
        ctx.printAllPlayerInstructions(session);
        return 'Continue'
    }

    await ctx.executeVendorPlayerTrade(itemRef, session);
    ctx.printAllPlayerInstructions(session);

    return 'Continue';
}

function executeCommandSelection(rawAnswer: string, session: VendorSession, ctx: VendorContext): VendorOptions {
    const formattedAnswer = formatCommand(rawAnswer);
    return ctx.playerAnswer(formattedAnswer, session, ctx);
}

function hasSelectedValidItem(rawAnswer: string, session: VendorSession, ctx: VendorContext): ItemReference | null {
    const playerNumber = parseInt(rawAnswer);
    const itemReferenceChosen = ctx.selectItem(playerNumber, session);

    if (itemReferenceChosen === null) {
        return null;
    }

    const item = GameItems.find(x => x.id === itemReferenceChosen.id);
    if (!item) {
        return null;
    }

    return itemReferenceChosen;
}

export function printSuccessfulItemPurchase(item: Item): VendorOptions {
    console.log(`Ye purchased ${item.name} for ${item.baseValue} Doubloons!`);
    return 'Continue';
}

export function nextPage(ctx: VendorContext, session: VendorSession): VendorOptions {
    ctx.nextPage(session)
    return 'Next Page';
}

export function previousPage(ctx: VendorContext, session: VendorSession): VendorOptions {
    ctx.previousPage(session)
    return 'Previous Page';
}

export function sellCargo(ctx: VendorContext, session: VendorSession): VendorOptions {
    ctx.vendorStrategy = new SellStrategy();
    ctx.printAllPlayerInstructions(session);
    return 'Continue';
}

export function buyItems(ctx: VendorContext, session: VendorSession): VendorOptions {
    ctx.vendorStrategy = new BuyStrategy();
    ctx.printAllPlayerInstructions(session);
    return 'Continue'
}

export function returnToMenu(): VendorOptions {
    return 'Return';
}

export function printAllSellCargoInformation(player: Player) {
    printCargoHeader(player);

    const cargo = player.ship.cargo;
    printInventoryStock(cargo);
    printPageNumber(cargo);
}

export function printAllVendorInformation(session: VendorSession) {
    const { vendor, player } = session;

    printVendorHeader(player);
    printInventoryStock(vendor);
    printPageNumber(vendor);
}

export function printPlayerAtVendorInstructions() {
    console.log("Type the number of the item you wish to buy, or type 'next page' or 'previous page' to see what else this vendor has.");
    console.log("If you wish to sell your cargo, type 'sell cargo'.");
    console.log("Type 'return' if you wish to go back.");
}

// need to put my logs into some instruction builder at some point
export function printPlayerSellingCargoInstructions() {
    console.log("Type the number of the item you wish to sell, or type 'next page' or 'previous page' to see what other items you have.")
    console.log("If you wish to buy an item, type 'buy items'.");
    console.log("Type 'return' if you wish to go back.");
}

export function printVendorHeader(player: Player) {
    console.log(newLine(1));
    console.log(`Current balance: ${player.balance} Doubloons`);
    console.log(`===== ${player.dockedAt.name} Vendor Stock =====`);
}

export function printCargoHeader(player: Player) {
    console.log(newLine(1));
    console.log(`Current balance: ${player.balance} Doubloons`);
    console.log(`===== Selling Cargo at ${player.dockedAt.name} =====`);
}
