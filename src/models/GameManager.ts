import { createInterface } from "readline/promises";
import type Player from "./Player";
import { stdin, stdout } from "process";
import type { GameState } from "../types/GameState";
import { viewShip } from "./Ship";
import { completer, formatCommand } from "../utils/TextUtils";

export default class GameManager {
    private _duration: number;
    private _seed: number;
    private _player: Player;
    private _exitGame: boolean;
    private _state: GameState;

    constructor(duration: number, seed: number, player: Player) {
        this._duration = duration;
        this._seed = seed;
        this._player = player;
        this._exitGame = false;
        this._state = 'At Island';
    }

    public get daysRemaining(): number {
        return this._duration;
    }

    public async run() {
        while (!this._exitGame) {
            this._state = await this.handleState(this._state);
        }
    }

    public printValues() {
        console.log(this._duration, this._seed);
    }

    public printAvailableCommands() {
        this.run();
    }

    public async promptPlayer(): Promise<GameState> {
        const rl = createInterface({
            input: stdin,
            output: stdout,
            completer: completer
        });
        this.printCommands();
        const playerResponse = await rl.question('What would you like to do? ');
        rl.close();

        return formatCommand(playerResponse) as GameState;
    }

    public printCommands() {
        console.log('======================');
        console.log('Days remaining: %d', this.daysRemaining);
        console.log('Current balance: %d', this._player.balance);
        console.log('Docked at: %s', this._player.dockName);
        console.log('======================');
        console.log('Available Commands:');
        console.log('- View Ship');
        console.log('- View Cargo');
        console.log('- Visit Docks');
        console.log('- Visit Vendor');
        console.log('- Hire Crew');
        console.log('- Exit');
    }

    public handleState(state: GameState): Promise<GameState> {
        switch (state) {
            case 'At Island':
                return this.promptPlayer();
            case 'View Ship':
                return viewShip(this._player.ship)
            case 'Exit':
                return this.endGame();
            default:
                console.log(`Invalid State ${state}. Please try again`);
                return this.promptPlayer();
        }
    }

    public async endGame(): Promise<GameState> {
        this._exitGame = true;
        return 'Exit';
    }
}