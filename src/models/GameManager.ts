import type Player from "./Player";
import type { GameState } from "../types/GameState";
import { formatCommand } from "../utils/TextUtils";
import { viewCargo } from "./Cargo";
import { viewShip, hireCrew } from "./Ship";
import { Vendor, visitVendor } from "./Vendor";
import type { Interface } from "node:readline/promises";
import { visitDocks } from "./Island";

export default class GameManager {
    private _duration: number;
    private _seed: number;
    private _player: Player;
    private _exitGame: boolean;
    private _state: GameState;
    private _vendor: Vendor;
    private _rl: Interface;

    constructor(duration: number, seed: number, player: Player, rl: Interface) {
        this._duration = duration;
        this._seed = seed;
        this._player = player;
        this._exitGame = false;
        this._state = 'At Island';
        this._vendor = new Vendor(); // not final lol - this will need to be a list of Vendors I would guess?
        this._rl = rl;
    }

    get daysRemaining(): number {
        return this._duration;
    }

    async run() {
        while (!this._exitGame) {
            this._state = await this.handleState(this._state);
        }
    }

    printValues() {
        console.log(this._duration, this._seed);
    }

    beginGame() {
        this.run();
    }

    async promptPlayer(): Promise<GameState> {
        this.printCommands();
        const playerResponse = await this._rl.question('What would you like to do? ');
        return formatCommand(playerResponse) as GameState;
    }

    printCommands() {
        console.log('======================');
        console.log('Days remaining: %d', this.daysRemaining);
        console.log('Current balance: %d', this._player.balance);
        console.log('Islanded at: %s', this._player.islandName);
        console.log('======================');
        console.log('Available Commands:');
        console.log('- View Ship');
        console.log('- View Cargo');
        console.log('- Visit Docks');
        console.log('- Visit Vendor');
        console.log('- Hire Crew');
        console.log('- Exit');
    }

    handleState(state: GameState): Promise<GameState> {
        switch (state) {
            case 'At Island':
                return this.promptPlayer();
            case 'View Ship':
                return viewShip(this._player.ship)
            case 'View Cargo':
                return viewCargo(this._player.ship, this._rl);
            case 'Visit Docks':
                return visitDocks(this._player, this._rl)
            case 'Visit Vendor':
                return visitVendor(this._vendor, this._player, this._rl);
            case 'Hire Crew':
                return hireCrew(this._player, this._rl);
            case 'Exit':
                return this.endGame();
            default:
                console.log(`Invalid command ${state}. Please try again`);
                return this.promptPlayer();
        }
    }

    async endGame(): Promise<GameState> {
        this._exitGame = true;
        this._rl.close();
        return 'Exit';
    }
}