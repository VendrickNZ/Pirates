import type { Rl } from "../types/Rl";
import type { GameState } from "../types/GameState";
import { ItemLookup, type Inventory } from "../types/Item";
import { cleanInventory, Page, paginate, printInventoryStock, printPageNumber, updateInventoryPrices, updateCargoPrices, type ContinuePrompting, type PageCommand as PageCommand } from "../types/Page";
import { expandAlias, formatCommand, printHeader, printInformation, prompt, resetCompletions, setCompletions, type AliasMap } from "../utils/TextUtils";
import type Player from "./Player";
import type { Ship } from "./Ship";
import type { VendorSession } from "./Vendor";

const CARGO_COMMANDS = ['Next Page', 'Previous Page', 'Return'];
const CARGO_ALIASES: AliasMap = {
    'N': 'Next Page',
    'P': 'Previous Page',
    'R': 'Return',
};

export default class Cargo {
    private _inventory: Inventory;
    private _page: Page;

    constructor(startingInventory?: Inventory) {
        this._inventory = startingInventory ?? [];
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

    get page() {
        return this._page;
    }

    async playerCommand(rl: Rl) {
        setCompletions(CARGO_COMMANDS);
        let choice;
        while (choice !== 'Return') {
            choice = await this.promptPlayer(rl);
        }
        resetCompletions();
    }

    async promptPlayer(rl: Rl): Promise<PageCommand | ContinuePrompting> {
        this.printCargoContent();
        this.printViewCargoCommands();
        const rawAnswer = await prompt(rl);

        const expanded = expandAlias(formatCommand(rawAnswer), CARGO_ALIASES);

        return this.executePlayerCommand(expanded as PageCommand);
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
        console.log('');
        console.log("[N] Next Page  [P] Previous Page  [R] Return");
    }

    printCargoContent() {
        printInventoryStock(this);
        printPageNumber(this);
    }

    printEmptyInventoryMessage() {
        printInformation('Ye have no cargo!');
    }

    async sellItem(id: number, session: VendorSession) {
        const { player, vendor } = session;
        const itemRef = this.inventory.find(item => item.id === id);
        if (!itemRef) return false;

        const item = ItemLookup.get(itemRef.id);
        if (!item) return false;

        updateCargoPrices(vendor, player);
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
            printInformation('Ye have no cargo!')
            return false;
        }
        return true;
    }


}

export async function viewCargo(ship: Ship, rl: Rl): Promise<GameState> {
    if (ship.cargo.hasCargo()) {
        await ship.viewCargo(rl);
    }
    return 'At Island'
}

export function printAllSellCargoInformation(session: VendorSession) {
    const { player, vendor } = session;
    const cargo = player.ship.cargo;
    updateCargoPrices(vendor, player);
    paginate(cargo);

    printSellCargoHeader(player);
    printInventoryStock(cargo);
    printPageNumber(cargo);
}

export function printSellCargoHeader(player: Player) {
    printHeader(`Selling Cargo at ${player.island.name}`);
    console.log(`Balance: ${player.balance} Doubloons`);
}

export function printSellCargoInstructions() {
    console.log('');
    console.log("Type an item number to sell. [N] Next Page  [P] Previous Page  [B] Buy Items  [R] Return");
}