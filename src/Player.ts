export default class Player {
    private _name: string

    constructor(name: string) {
        this._name = name;
    }

    public getName() {
        return this._name;
    }
}