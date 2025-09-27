import type Player from "./Player";
import type { GameState } from "../types/GameState";
import { completer, formatCommand } from "../utils/TextUtils";
import { constructReadline } from "../utils/ReadlineUtils";
import { viewShipCargo } from "./Cargo";
import { viewShip, hireCrew } from "./Ship";
import { Vendor, visitVendor } from "./Vendor";

export default class GameManager {
    private _duration: number;
    private _seed: number;
    private _player: Player;
    private _exitGame: boolean;
    private _state: GameState;
    private _vendor: Vendor;

    constructor(duration: number, seed: number, player: Player) {
        this._duration = duration;
        this._seed = seed;
        this._player = player;
        this._exitGame = false;
        this._state = 'At Island';
        this._vendor = new Vendor(); // not final lol
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

    printAvailableCommands() {
        this.run();
    }

    async promptPlayer(): Promise<GameState> {
        const rl = constructReadline(completer);
        this.printCommands();
        const playerResponse = await rl.question('What would you like to do? ');
        rl.close();

        return formatCommand(playerResponse) as GameState;
    }

    printCommands() {
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

    handleState(state: GameState): Promise<GameState> {
        switch (state) {
            case 'At Island':
                return this.promptPlayer();
            case 'View Ship':
                return viewShip(this._player.ship)
            case 'View Cargo':
                return viewShipCargo(this._player.ship);
            case 'Visit Docks':
                return viewShip(this._player.ship)
            case 'Visit Vendor':
                return visitVendor(this._vendor, this._player);
            case 'Hire Crew':
                return hireCrew(this._player);
            case 'Exit':
                return this.endGame();
            default:
                console.log(`Invalid command ${state}. Please try again`);
                return this.promptPlayer();
        }
    }

    async endGame(): Promise<GameState> {
        this._exitGame = true;
        return 'Exit';
    }
}