import { createInterface } from "readline/promises";
import IslandCommand from "./commands/IslandCommand";
import type Player from "./Player";
import { stdin, stdout } from "process";

export default class GameManager {
    //private _currentState: number;
    private _duration: number;
    private _seed: number;
    private _player: Player;

    constructor(duration: number, seed: number, player: Player) {
        this._duration = duration;
        this._seed = seed;
        this._player = player;
    }

    public printValues() {
        console.log(this._duration, this._seed);
    }

    public printAvailableCommands() {
        const command = new IslandCommand(this, this._player);
        command.printCommands();
        this.promptPlayer();
        // based off state
        // switch? if state this then call sub function
        // sub function decides what to do based on context
    }

    public promptPlayer() {
        const rl = createInterface({
            input: stdin,
            output: stdout
        });

        rl.question('What would you like to do? ');
    }

    public get daysRemaining(): number {
        return this._duration;
    }
}