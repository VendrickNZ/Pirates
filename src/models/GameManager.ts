import type Player from "./Player";
import type { GameState } from "../types/GameState";
import { formatCommand } from "../utils/TextUtils";
import { viewCargo } from "./Cargo";
import { viewShip, hireCrew } from "./Ship";
import { visitVendor } from "./Vendor";
import type { Interface } from "node:readline/promises";
import { visitDocks, WorldGraph } from "./WorldGraph";
import { GameOverError, type GameOverReason } from "./GameOver";
export default class GameManager {
    private _duration: number;
    private _seed: number;
    private _player: Player;
    private _exitGame: boolean;
    private _state: GameState;
    private _rl: Interface;
    private _worldGraph: WorldGraph;

    constructor(duration: number, seed: number, player: Player, rl: Interface) {
        this._duration = duration;
        this._seed = seed;
        this._player = player;
        this._exitGame = false;
        this._state = 'At Island';
        this._rl = rl;
        this._worldGraph = new WorldGraph();
    }

    get daysRemaining(): number {
        return this._duration;
    }

    set daysRemaining(daysRemaining: number) {
        if (daysRemaining < 0) {
            throw new GameOverError('Time');
        }
        this._duration = daysRemaining;
    }

    async run() {
        try {
            while (!this._exitGame) {
                this._state = await this.handleState(this._state);
            }
        }
        catch (e) {
            if (e instanceof GameOverError) {
                await this.endGame(e.reason);
            } else {
                throw(e);
            }
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
        console.log('Docked at: %s', this._player.islandName);
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
                return this.handleVisitDocks();
            case 'Visit Vendor':
                return visitVendor(this._player, this._rl);
            case 'Hire Crew':
                return hireCrew(this._player, this._rl);
            case 'Exit':
                return this.endGame('Selected Exit');
            default:
                console.log(`Invalid command ${state}. Please try again`);
                return this.promptPlayer();
        }
    }

    async handleVisitDocks(): Promise<GameState> {
        const result = await visitDocks(this._player, this._rl, this._worldGraph);
        this.daysRemaining -= result.daysPassed;
        return result.nextState;
    }

    async endGame(reason: GameOverReason): Promise<GameState> {
        printEndOfGameInformation(reason);
        this._exitGame = true;
        this._rl.close();
        return 'Exit';
    }
}

function printEndOfGameInformation(reason: GameOverReason) {
    switch (reason) {
        case 'Selected Exit':
            console.log('You selected Exit. Game over!');
            break;
        case 'Combat':
            console.log('You died in combat. Game over!');
            break;
        case 'Time':
            console.log('You ran out of time. Game over!');
            break;
        case 'Weather':
            console.log('You died in a storm. Game over!');
            break;
    }

    console.log('Your final score is xxx');
}