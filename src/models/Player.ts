import { getStartingDock, type Dock } from "../types/Dock"
import { GameItems, type Item, type ItemReference } from "../types/Item"
import { createShip, type Ship } from "./Ship"

export default class Player {
    private _name: string
    private _balance: number
    private _dockedAt: Dock
    private _ship: Ship

    constructor(name: string) {
        this._name = name;
        this._balance = 0;
        this._dockedAt = getStartingDock();
        this._ship = createShip('StartingShip')

        this.addFunds(750);
    }

    get name(): string {
        return this._name;
    }

    get balance(): number {
        return this._balance;
    }

    get dockedAt(): Dock {
        return this._dockedAt;
    }

    get dockName(): string {
        return this.dockedAt.name;
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

    canPurchase(cost: number, weight: number) {
        const hasEnoughMoney = (this.balance - cost) >= 0;
        const shipHasEnoughSpace = (this.ship.currentWeight + weight <= this.ship.maxWeight);

        return hasEnoughMoney && shipHasEnoughSpace;
    }

    // assumes Player can purchase
    purchaseItem(itemRef: ItemReference) {
        const chosenItem = GameItems.find(x => x.id == itemRef.id);
        if (!chosenItem) return;

        this._balance -= chosenItem.baseValue;
        this._ship.currentWeight += chosenItem.weight;
        this._ship.addCargo(itemRef);
    }
}