interface Upgrade {
    currentNumber: number
    maxNumber: number
}

export default class Upgrades implements Upgrade {
    private _currentNumber: number;
    private _maxNumber: number;

    constructor() {
        this._currentNumber = 0;
        this._maxNumber = 0; // this will become = ship.upgradeSlots or something
    }

    get currentNumber() {
        return this._currentNumber;
    }

    get maxNumber() {
        return this._maxNumber;
    }
}
