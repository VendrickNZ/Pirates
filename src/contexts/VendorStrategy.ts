import { printAllSellCargoInformation, printSellCargoInstructions } from "../models/Cargo";
import { buyItems, nextPage, previousPage, printAllVendorInformation, printPlayerAtVendorInstructions, returnToMenu, sellCargo, type VendorOptions, type VendorSession } from "../models/Vendor";
import { type ItemReference } from "../types/Item";
import { PAGE_SIZE, paginate } from "../types/Page";
import { printInformation } from "../utils/TextUtils";
import type { VendorContext } from "./VendorContext";

export interface VendorStrategy {
    printPlayerInformation(session: VendorSession): void
    printPlayerCommands(): void
    executeVendorPlayerTrade(itemRef: ItemReference, session: VendorSession): Promise<VendorOptions>;
    nextPage(session: VendorSession): void
    previousPage(session: VendorSession): void
    selectItem(number: number, session: VendorSession): ItemReference | null
    playerAnswer(answer: string, session: VendorSession, ctx: VendorContext): VendorOptions
}

/** Look into making these templated? */
export class BuyStrategy implements VendorStrategy {

    constructor() { }

    printPlayerInformation(session: VendorSession): void {
        printAllVendorInformation(session);
    }

    printPlayerCommands(): void {
        printPlayerAtVendorInstructions();
    }

    async executeVendorPlayerTrade(itemRef: ItemReference, session: VendorSession): Promise<VendorOptions> {
        const { player, vendor } = session;

        await vendor.buyItem(itemRef.id, player);
        paginate(vendor);
        return 'Continue';
    }

    nextPage(session: VendorSession) {
        const { vendor } = session;
        vendor.page.nextPage();
        printAllVendorInformation(session);
        printPlayerAtVendorInstructions();
    }

    previousPage(session: VendorSession) {
        const { vendor } = session;
        vendor.page.previousPage();
        printAllVendorInformation(session);
        printPlayerAtVendorInstructions();
    }
    
    selectItem(number: number, session: VendorSession): ItemReference | null {
        const { vendor } = session;
        const currentPage = vendor.page.currentPageNumberIndex;
        const page = vendor.page.pageItems[currentPage];

        if (!page || page.length === 0) {
            printInformation('Thar be no cargo on this page, yarrr');
            return null;
        }

        const startIndex = currentPage * PAGE_SIZE + 1;
        const endIndex = startIndex + page.length - 1;

        if (number < startIndex || number > endIndex) {
            printInformation('yer number is out of bounds, yarrr');
            return null;
        }

        const numberIndexInPage = number - startIndex;
        return page[numberIndexInPage];
    }

    playerAnswer(answer: string, session: VendorSession, ctx: VendorContext): VendorOptions {
        switch (answer) {
            case 'Next Page': {
                return nextPage(ctx, session);
            }
            case 'Previous Page': {
                return previousPage(ctx, session);
            }
            case 'Sell Cargo': {
                return sellCargo(ctx, session);
            }
            case 'Return': {
                return returnToMenu();
            }
            default: {
                return returnToMenu();
            }
        }
    }
}

export class SellStrategy implements VendorStrategy {
    constructor() {}

    printPlayerInformation(session: VendorSession): void {
        const { player } = session;
        printAllSellCargoInformation(player);
    }

    printPlayerCommands(): void {
        printSellCargoInstructions();
    }

    async executeVendorPlayerTrade(itemRef: ItemReference, session: VendorSession): Promise<VendorOptions> {
        const { player } = session;
        const cargo = player.ship.cargo;

        await cargo.sellItem(itemRef.id, session);
        paginate(cargo);
        return 'Continue';
    }

    nextPage(session: VendorSession) {
        const { player } = session;
        player.ship.cargo.page.nextPage();
        printAllSellCargoInformation(player);
        printSellCargoInstructions();
    }

    previousPage(session: VendorSession) {
        const { player } = session;
        player.ship.cargo.page.previousPage();
        printAllSellCargoInformation(player);
        printSellCargoInstructions();
    }

    selectItem(number: number, session: VendorSession): ItemReference | null {
        const { player } = session;
        const cargo = player.ship.cargo;

        const currentPage = cargo.page.currentPageNumberIndex;
        const page = cargo.page.pageItems[currentPage];

        if (!page || page.length === 0) {
            printInformation('Thar be no cargo on this page, yarrr');
            return null;
        }

        const startIndex = currentPage * PAGE_SIZE + 1;
        const endIndex = startIndex + page.length - 1;

        if (number < startIndex || number > endIndex) {
            printInformation('yer number is out of bounds, yarrr');
            return null;
        }

        const numberIndexInPage = number - startIndex;
        return page[numberIndexInPage];
    }

    playerAnswer(answer: string, session: VendorSession, ctx: VendorContext): VendorOptions {
        switch (answer) {
            case 'Next Page': {
                return nextPage(ctx, session);
            }
            case 'Previous Page': {
                return previousPage(ctx, session);
            }
            case 'Buy Items': {
                return buyItems(ctx, session);
            }
            case 'Return': {
                return returnToMenu();
            }
            default: {
                return returnToMenu();
            }
        }
    }
}