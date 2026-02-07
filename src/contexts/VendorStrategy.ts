import { printAllSellCargoInformation, printAllVendorInformation, printPlayerAtVendorInstructions, printPlayerSellingCargoInstructions, type VendorOptions, type VendorSession } from "../models/Vendor";
import { type ItemReference } from "../types/Item";
import { paginate } from "../types/Page";

export interface VendorStrategy {
    printPlayerInformation(session: VendorSession): void
    printPlayerCommands(): void
    executeVendorPlayerTrade(itemRef: ItemReference, session: VendorSession): Promise<VendorOptions>;
    nextPage(session: VendorSession): void
    previousPage(session: VendorSession): void
}

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
        vendor.page.currentPageNumberIndex++;
        printAllVendorInformation(session);
        printPlayerAtVendorInstructions();
    }

    previousPage(session: VendorSession) {
        const { vendor } = session;
        vendor.page.currentPageNumberIndex--;
        printAllVendorInformation(session);
        printPlayerAtVendorInstructions();
    }
}

export class SellStrategy implements VendorStrategy {
    constructor() {}

    printPlayerInformation(session: VendorSession): void {
        const { player } = session;
        printAllSellCargoInformation(player);
    }

    printPlayerCommands(): void {
        printPlayerSellingCargoInstructions();
    }

    async executeVendorPlayerTrade(itemRef: ItemReference, session: VendorSession): Promise<VendorOptions> {
        const { player, vendor } = session;

        await vendor.buyItem(itemRef.id, player);
        paginate(vendor);
        return 'Continue';
    }

    nextPage(session: VendorSession) {
        const { player } = session;
        player.ship.cargo.page.currentPageNumberIndex++;
        printAllSellCargoInformation(player);
        printPlayerSellingCargoInstructions();
    }

    previousPage(session: VendorSession) {
        const { player } = session;
        player.ship.cargo.page.currentPageNumberIndex--;
        printAllSellCargoInformation(player);
        printPlayerSellingCargoInstructions();
    }
}