import { GameItems, type ItemReference } from "../types/Item"
import { formatFloat, printInformationWithDelay } from "../utils/TextUtils"
import { createShip, type Ship } from "./Ship"
import type { Vendor } from "./Vendor"
import { type Island, getStartingIsland } from "./Island";

export default class Player {
    private _name: string
    private _balance: number
    /** Minor note 4fun here, this is an extrinsic attribute and should be on another object - not worth to change now */
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

    calculateCrewWageCost(daysPassed: number) {
        return formatFloat((this.ship.crew * this.ship.wagesPerDay) * daysPassed);
    }

    canAffordToPayWages(daysPassed: number) {
        const cost = this.calculateCrewWageCost(daysPassed);
        if (this._balance - cost >= 0) {
            this.deductWages(cost);
            return true;
        }
        console.log('ye cannot afford ye ship mates yarrrr');
        console.log(`ye shipmates are costin ya ${cost} doubloons but ye only have ${this.balance}`);
        return false;
    }

    deductWages(cost: number) {
        this._balance -= cost;
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

    /** assumes Player can purchase */
    purchaseItem(itemRef: ItemReference, itemPrice: number) {
        const chosenItem = GameItems.find(x => x.id == itemRef.id);
        if (!chosenItem) return;

        itemRef.units--;

        console.log(`I am purchasing for ${itemPrice}`);
        this._balance -= itemPrice;
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

        this._balance += itemRef.currentValue;
        this._ship.currentWeight -= chosenItem.weight;
        this._ship.removeCargo(itemRef);
    }
}