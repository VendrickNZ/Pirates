export class GameOverError extends Error {
    private _cause: GameOverReason;
    constructor(cause: GameOverReason) {
        super('Game over');
        this._cause = cause;
    }

    get reason() {
        return this._cause;
    }
}

export type GameOverReason =
    | 'Selected Exit'
    | 'Time'
    | 'Combat'
    | 'Weather'