export default class GameManager {
    private _duration: number;
    private _seed: number;

    constructor(duration: number, seed: number) {
        this._duration = duration;
        this._seed = seed;
    }

    public printValues() {
        console.log(this._duration, this._seed);
    }
}

