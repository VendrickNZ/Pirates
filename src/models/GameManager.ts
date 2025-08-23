import IslandCommand from "./commands/IslandCommand";
import type Player from "./Player";

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
        // based off state
        // switch? if state this then call sub function
        // sub function decides what to do based on context
    }

    public get daysRemaining(): number {
        return this._duration;
    }
}

/** based on state, do something */
/** need to figure out how to make a builder for text? */

/** possible states:
 * view ship
 * view cargo
 * at vendor
 * at dock
 * hire crew
 * base state?
 * 
 * travelling/combat/randomevent
 * 
 * 
 * 
 * **/