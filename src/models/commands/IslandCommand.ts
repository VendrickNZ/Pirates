import type { Dock } from "../../types/Dock";
import type GameManager from "../GameManager";
import type Player from "../Player";

export default class IslandCommand {
    private _daysRemaining: number;
    private _balance: number;
    private _dock: Dock;

    constructor(gameManager: GameManager, player: Player) {
        this._daysRemaining = gameManager.daysRemaining;
        this._balance = player.balance
        this._dock = player.dockedAt;
    }
}