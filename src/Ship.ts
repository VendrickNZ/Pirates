export interface Ship {
    name: string
    health: number
}

// gonna make this some factory or rather
export class BaseShip implements Ship {
    private _name: string
    private _health: number

    constructor() {
        this._name = "The Black Pearl"
        this._health = 20;
    }

    public get name(): string {
        return this._name;
    }
    public get health(): number {
        return this._health;
    }
}