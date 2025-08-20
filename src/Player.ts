import { getStartingDock, type Dock } from "./DeserializeDocks"
import { BaseShip, type Ship } from "./Ship"

export default class Player {
    private _name: string
    private _balance: number
    private _dockedAt: Dock
    private _ship: Ship

    constructor(name: string) {
        this._name = name;
        this._balance = 0; // currency.AddFunds()? 
        this._dockedAt = getStartingDock();
        this._ship = new BaseShip();
    }

    public get name(): string {
        return this._name;
    }

    public get balance(): number {
        return this._balance;
    }

    public get dockedAt(): Dock {
        return this._dockedAt;
    }

    public get ship(): Ship {
        return this._ship;
    }
}