import type { Interface } from "readline/promises";
import type { GameState } from "../types/GameState";
import { formatCommand, isNumber, newLine, printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import { cleanInventory, Page, paginate, printInventoryStock, printPageNumber, updateInventoryPrices } from "../types/Page";
import { GameItems, type Inventory, getItems, type ItemReference, getUpgradeItems, GameUpgrades } from "../types/Item";
import { recomputePrices } from "./Market";
import { VendorContext } from "../contexts/VendorContext";
import { BuyStrategy, SellStrategy } from "../contexts/VendorStrategy";
import type { IslandCommoditiesTable } from "./Island";

const STARTING_VENDOR_BALANCE = 250;

export type VendorOptions = 'Next Page' | 'Previous Page' | 'Sell Cargo' | 'Return' | 'Continue';
export type VendorSession = {
    vendor: Vendor,
    player: Player
}

export class Vendor {
    private _balance: number;
    private _inventory: Inventory;
    private _page: Page;
    private _commodities: IslandCommoditiesTable;

    constructor(commodityMultipliers: IslandCommoditiesTable) {
        this._balance = STARTING_VENDOR_BALANCE;
        this._inventory = restock();
        this._page = new Page(this.inventory);
        this._commodities = commodityMultipliers;
        paginate(this);
    }

    get balance() {
        return this._balance;
    }

    get inventory() {
        return this._inventory;
    }

    get page() {
        return this._page;
    }

    get commodities() {
        return this._commodities;
    }

    /** Checks if the Player can purchase item, if so, purchases it. */
    async buyItem(id: number, player: Player) {
        const itemRef = this.inventory.find(item => item.id === id);
        if (!itemRef) return false;

        const item = GameItems.find(x => x.id === itemRef.id);
        if (!item) return false;

        const itemPrice = recomputePrices(item, this._commodities, player)
        
        if (!(await player.canPurchase(itemPrice, item.weight))) return false;
        
        player.purchaseItem(itemRef, itemPrice);
        cleanInventory(this);
        updateInventoryPrices(this, player);

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
            const newItem: ItemReference = { id: itemRef.id, units: 1, currentValue: itemRef.currentValue };
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
    const items = getItems(50);
    return items;
}

function setupInitialVendorPages(vendor: Vendor) {
    vendor.page.currentPageNumberIndex = 0;
    paginate(vendor);
    vendor.page.maxPageNumber = vendor.page.calculateMaxPages(vendor.inventory);
}

export async function visitVendor(player: Player, rl: Interface): Promise<GameState> {
    const vendor = player.island.vendor;
    const session: VendorSession = { vendor, player };
    const vendorContext = new VendorContext(new BuyStrategy());
    updateInventoryPrices(vendor, player);
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

export function printVendorHeader(player: Player) {
    console.log(newLine(1));
    console.log(`Current balance: ${player.balance} Doubloons`);
    console.log(`===== ${player.island.name} Vendor Stock =====`);
}
