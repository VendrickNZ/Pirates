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

    public printCommands() {
        console.log('======================');
        console.log('Days remaining: %d', this._daysRemaining);
        console.log('Current balance: %d', this._balance);
        console.log('Docked at: %s', this._dock.name);
        console.log('======================');
        console.log('Available Commands:');
        console.log('- View Ship');
        console.log('- View Cargo');
        console.log('- Visit Docks');
        console.log('- Visit Vendor');
        console.log('- Hire Crew');
        console.log('- Exit');
        console.log('What would you like to do?');
    }
}