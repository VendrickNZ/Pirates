import { createInterface } from "readline/promises";
import IslandCommand from "./commands/IslandCommand";
import type Player from "./Player";
import { stdin, stdout } from "process";
import type { GameState } from "../types/GameState";

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
        const command = new IslandCommand(this, this._player);
        command.printCommands();
        this.run();

    }

    public async promptPlayer(): Promise<GameState> {
        const rl = createInterface({
            input: stdin,
            output: stdout
        });

        const playerResponse = await rl.question('What would you like to do? ');
        rl.close();

        return playerResponse as GameState;
    }

    public handleState(state: GameState): Promise<GameState> {
        switch (state) {
            case 'At Island':
                return this.promptPlayer();
            case 'View Ship':
                return this.viewShip()
            case 'Exit':
                return this.endGame();
            default:
                console.log(`Invalid State ${state}. Please try again`);
                return this.promptPlayer();
        }
    }
    public async viewShip(): Promise<GameState> {
        console.log('Print stuff...');
        setTimeout(() => {}, 2500) // make a func for this
        return 'At Island'
    }

    public async endGame(): Promise<GameState> {
        this._exitGame = true;
        return 'Exit';
    }
}