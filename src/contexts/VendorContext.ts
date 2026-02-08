import { type VendorOptions, type VendorSession } from "../models/Vendor";
import type { ItemReference } from "../types/Item";
import type { VendorStrategy } from "./VendorStrategy";

export class VendorContext {
    private _vendorStrategy: VendorStrategy;

    constructor(vendorStrategy: VendorStrategy) {
        this._vendorStrategy = vendorStrategy;
    }

    set vendorStrategy(vendorStrategy: VendorStrategy) {
        this._vendorStrategy = vendorStrategy;
    }

    get vendorStrategy() {
        return this._vendorStrategy;
    }

    printPlayerInformation(session: VendorSession){
        this.vendorStrategy.printPlayerInformation(session);
    }

    printPlayerCommands(){
        this.vendorStrategy.printPlayerCommands();
    }

    printAllPlayerInstructions(session: VendorSession) {
        this.vendorStrategy.printPlayerInformation(session);
        this.vendorStrategy.printPlayerCommands();
    }

    async executeVendorPlayerTrade(itemRef: ItemReference, session: VendorSession): Promise<VendorOptions>{
        return await this.vendorStrategy.executeVendorPlayerTrade(itemRef, session);
    }

    nextPage(session: VendorSession) {
        this.vendorStrategy.nextPage(session);
    }

    previousPage(session: VendorSession) {
        this.vendorStrategy.previousPage(session);
    }

    selectItem(number: number, session: VendorSession) {
        return this.vendorStrategy.selectItem(number, session);
    }
}