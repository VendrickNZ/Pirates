import { createInterface } from "readline/promises";
import IslandCommand from "./commands/IslandCommand";
import type Player from "./Player";
import { stdin, stdout } from "process";
import type { State } from "../types/State";
import IslandState from "../states/IslandState";
import ViewShipState from "../states/viewShipState";

export default class GameManager {
    //private _currentState: number;
    private _duration: number;
    private _seed: number;
    private _player: Player;
    private _activeState: State;

    constructor(duration: number, seed: number, player: Player) {
        this._duration = duration;
        this._seed = seed;
        this._player = player;
        this._activeState = new IslandState();
    }

    public printValues() {
        console.log(this._duration, this._seed);
    }

    public printAvailableCommands() {
        const command = new IslandCommand(this, this._player);
        command.printCommands();
        this.promptPlayer();

    }

    public async promptPlayer() {
        const rl = createInterface({
            input: stdin,
            output: stdout
        });

        const playerResponse = await rl.question('What would you like to do? ');
        rl.close();

        this.nextState(playerResponse);
    }

    public input(): void {

    }

    public update(): void {

    }

    public changeState(state: State): void {
        this._activeState = state;
    }

    public nextState(response: string) {
        switch(response) {
            case 'View Ship':
                this.changeState(new ViewShipState())
                break;
            default:
                console.log(`Invalid response: ${response}. Please try again`);
                this.promptPlayer();
                break;
        }
    }

    public viewShip() {
        console.log('Print stuff...');
        setTimeout(this.promptPlayer, 5000)
    }

    public get daysRemaining(): number {
        return this._duration;
    }
}