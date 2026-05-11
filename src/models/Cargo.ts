import type { Interface } from "readline/promises";
import type { GameState } from "../types/GameState";
import { ItemLookup, type Inventory } from "../types/Item";
import { cleanInventory, Page, printInventoryStock, printPageNumber, updateInventoryPrices, type ContinuePrompting, type PageCommand as PageCommand } from "../types/Page";
import { formatCommand, newLine, printInformation, timeoutInSeconds } from "../utils/TextUtils";
import type Player from "./Player";
import type { Ship } from "./Ship";
import type { VendorSession } from "./Vendor";

export default class Cargo {
    private _maxCapacity: number;
    private _currentCapacity: number;
    private _inventory: Inventory;
    private _page: Page;

    constructor(maxCapacity: number, startingInventory?: Inventory) {
        this._inventory = startingInventory ?? [];
        if (startingInventory) this.calculateStartingCargoWeight();

        this._maxCapacity = maxCapacity
        this._currentCapacity = 0
        this._page = new Page(this.inventory)
        this.update();
    }
    update() {
        cleanInventory(this);
        this._page.max = this._page.calculateMaxPages(this.inventory);
    }

    get inventory() {
        return this._inventory;
    }

    get maxCapacity() {
        return this._maxCapacity;
    }

    set currentCapacity(newCapacity: number) {
        this._currentCapacity = newCapacity;
    }

    get currentCapacity(): number {
        return this._currentCapacity
    }

    get page() {
        return this._page;
    }

    async playerCommand(rl: Interface) {
        let choice;
        while (choice !== 'Return') {
            choice = await this.promptPlayer(rl);
        }
    }

    async promptPlayer(rl: Interface): Promise<PageCommand | ContinuePrompting> {
        this.printCargoContent();
        this.printViewCargoCommands();
        const rawAnswer = await rl.question('');

        const formattedAnswer = formatCommand(rawAnswer);


        return this.executePlayerCommand(formattedAnswer as PageCommand);
    }

    executePlayerCommand(answer: PageCommand): PageCommand | ContinuePrompting {
        switch (answer) {
            case 'Next Page':
                this.page.nextPage();
                return 'Next Page';
            
            case 'Previous Page':
                this.page.previousPage();
                return 'Previous Page';

            case 'Return':
                return 'Return'
            default:
                console.log('Arghhh... try again.');
                return 'Continue'
        }
    }

    printViewCargoCommands() {
        console.log(`Type 'next page' or 'previous page' to see what other items you have.`);
        console.log(`Type 'return' if you wish to go back.`);
    }

    printCargoContent() {
        printInventoryStock(this);
        printPageNumber(this);
    }

    printEmptyInventoryMessage() {
        printInformation('Ye cargo is empty!');
    }

    async sellItem(id: number, session: VendorSession) {
        const { player, vendor } = session;
        const itemRef = this.inventory.find(item => item.id === id);
        if (!itemRef) return false;

        const item = ItemLookup.get(itemRef.id);
        if (!item) return false;

        if (!(await player.canSell(itemRef.currentValue, vendor))) return false;

        player.sellItem(itemRef);
        vendor.acquireItem(itemRef);
        cleanInventory(this);
        updateInventoryPrices(vendor, player);

        this.page.updateMaxPages(this.inventory);
        vendor.page.updateMaxPages(vendor.inventory);
        return true;
    }

    hasCargo() {
        if (this._inventory.length === 0) {
            printInformation('You have no cargo!')
            return false;
        }
        return true;
    }

    calculateStartingCargoWeight() {
        for (const itemRef of this.inventory) {
            const item = ItemLookup.get(itemRef.id);
            this.currentCapacity += item?.weight ?? 0
        }
    }
}

export async function viewCargo(ship: Ship, rl: Interface): Promise<GameState> {
    if (ship.cargo.hasCargo()) {
        await ship.viewCargo(rl);
    }
    await timeoutInSeconds(3);
    return 'At Island'
}

export function printAllSellCargoInformation(player: Player) {
    printSellCargoHeader(player);

    const cargo = player.ship.cargo;
    printInventoryStock(cargo);
    printPageNumber(cargo);
}

export function printSellCargoHeader(player: Player) {
    console.log(newLine(1));
    console.log(`Current balance: ${player.balance} Doubloons`);
    console.log(`===== Selling Cargo at ${player.island.name} =====`);
}

// need to put my logs into some instruction builder at some point
export function printSellCargoInstructions() {
    console.log("Type the number of the item you wish to sell, or type 'next page' or 'previous page' to see what other items you have.")
    console.log("If you wish to buy an item, type 'buy items'.");
    console.log("Type 'return' if you wish to go back.");
}