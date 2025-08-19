type Dock = {
    name: string
}

export default class Player {
    private _name: string
    private _balance: number
    private _dockedAt: Dock

    constructor(name: string) {
        this._name = name;
        this._balance = 0;
        this._dockedAt = { name: 'Hi' };
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
}