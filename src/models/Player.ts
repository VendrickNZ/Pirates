import { GameItems, type ItemReference } from "../types/Item"
import { formatFloat, printInformationWithDelay } from "../utils/TextUtils"
import { createShip, type Ship } from "./Ship"
import type { Vendor } from "./Vendor"
import { type Island, getStartingIsland } from "./Island";


export default class Player {
    private _name: string
    private _balance: number
    private _island: Island
    private _ship: Ship

    constructor(name: string) {
        this._name = name;
        this._balance = 0;
        this._island = getStartingIsland();
        this._ship = createShip('StartingShip')

        this.addFunds(750);
    }

    get name(): string {
        return this._name;
    }

    get balance(): number {
        return formatFloat(this._balance);
    }

    get island(): Island {
        return this._island;
    }

    set island(island: Island) {
        this._island = island;
    }

    get islandName(): string {
        return this.island.name;
    }

    get ship(): Ship {
        return this._ship;
    }

    addFunds(funds: number) {
        this._balance += funds;
    }

    removeFunds(funds: number) {
        this._balance -= funds;
    }

    async canPurchase(cost: number, weight: number): Promise<boolean> {
        const hasEnoughMoney = (this.balance - cost) >= 0;
        if (!hasEnoughMoney) {
            await printInformationWithDelay('Yarrr ye are poor!', 1, 2);
        }
        const shipHasEnoughSpace = (this.ship.currentWeight + weight <= this.ship.maxWeight);
        if (!shipHasEnoughSpace) {
            await printInformationWithDelay('Ye ship is too small!', 1, 2);
        }

        return hasEnoughMoney && shipHasEnoughSpace;
    }

    // assumes Player can purchase
    purchaseItem(itemRef: ItemReference) {
        const chosenItem = GameItems.find(x => x.id == itemRef.id);
        if (!chosenItem) return;

        itemRef.units--;

        this._balance -= chosenItem.baseValue;
        this._ship.currentWeight += chosenItem.weight;
        this._ship.addCargo(itemRef);
    }

    // check if vendor has enough money
    async canSell(cost: number, vendor: Vendor) {
        const vendorHasEnoughMoney = (vendor.balance - cost) >= 0;

        if (!vendorHasEnoughMoney) {
            await printInformationWithDelay('The vendor be broke!', 1, 2);
        }

        return vendorHasEnoughMoney;
    }

    sellItem(itemRef: ItemReference) {
        const chosenItem = GameItems.find(x => x.id == itemRef.id);
        if (!chosenItem) return;

        itemRef.units++;

        this._balance += chosenItem.baseValue;
        this._ship.currentWeight -= chosenItem.weight;
        this._ship.removeCargo(itemRef);
    }
}