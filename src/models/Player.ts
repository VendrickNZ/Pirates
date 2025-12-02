import { getStartingDock, type Dock } from "../types/Dock"
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
    purchaseItem(cost: number, weight: number) {
        this._balance -= cost;
        this._ship.currentWeight += weight;
        this._ship.cargo

        return;
    }
}