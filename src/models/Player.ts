import { ItemLookup, type ItemReference } from "../types/Item"
import { formatFloat, printInformation } from "../utils/TextUtils"
import { createShip, type Ship } from "./Ship"
import type { Vendor } from "./Vendor"
import { type Island, getStartingIsland } from "./Island";

export default class Player {
    private _name: string
    private _balance: number
    /** Minor note 4fun here, this is an extrinsic attribute and should be on another object - not worth to change now */
    private _island: Island
    private _ship: Ship
    private _combatsWon: number

    constructor(name: string) {
        this._name = name;
        this._balance = 0;
        this._island = getStartingIsland();
        this._ship = createShip('StartingShip')
        this._combatsWon = 0;

        this.addFunds(750);
    }

    get name(): string {
        return this._name;
    }

    get combatsWon(): number {
        return this._combatsWon;
    }

    recordCombatWin() {
        this._combatsWon++;
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

    set ship(ship: Ship) {
        this._ship = ship;
    }

    calculateCrewWageCost(daysPassed: number) {
        return formatFloat((this.ship.crew * this.ship.wagesPerDay) * daysPassed);
    }

    canAffordToPayWages(daysPassed: number) {
        const cost = this.calculateCrewWageCost(daysPassed);
        if (this._balance - cost >= 0) {
            this.deductWages(cost);
            if (cost > 0) {
                console.log(`Ye paid yer crew ${cost} Doubloons fer ${daysPassed} days at sea.`);
            }
            return true;
        }
        console.log('Ye cannot afford yer shipmates, yarrrr!');
        console.log(`Yer crew be costin' ${cost} Doubloons but ye only have ${this.balance}.`);
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
            printInformation('Yarrr, ye be too poor!');
        }
        const shipHasEnoughSpace = (this.ship.currentWeight + weight <= this.ship.maxWeight);
        if (!shipHasEnoughSpace) {
            printInformation('Yer ship be too small!');
        }

        return hasEnoughMoney && shipHasEnoughSpace;
    }

    /** assumes Player can purchase */
    purchaseItem(itemRef: ItemReference, itemPrice: number) {
        const chosenItem = ItemLookup.get(itemRef.id);
        if (!chosenItem) return;

        this.ship.applyItemEffectIfApplicable(chosenItem);
        itemRef.units--;

        console.log(`Ye purchased ${chosenItem.name} for ${itemPrice} Doubloons!`);
        this._balance -= itemPrice;
        this.ship.addCargo(itemRef);

    }

    // check if vendor has enough money
    async canSell(cost: number, vendor: Vendor) {
        const vendorHasEnoughMoney = (vendor.balance - cost) >= 0;

        if (!vendorHasEnoughMoney) {
            printInformation('The vendor be broke!');
        }

        return vendorHasEnoughMoney;
    }

    sellItem(itemRef: ItemReference) {
        const chosenItem = ItemLookup.get(itemRef.id);
        if (!chosenItem) return;

        this.ship.removeItemEffectIfApplicable(chosenItem);
        this._balance += itemRef.currentValue;
        this._ship.removeCargo(itemRef);
    }
}