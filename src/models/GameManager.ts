import type Player from "./Player";
import type { GameState } from "../types/GameState";
import { expandAlias, formatCommand, MAIN_MENU_COMMANDS, printHeader, prompt, resetCompletions, type AliasMap } from "../utils/TextUtils";
import { viewCargo } from "./Cargo";
import { viewShip, hireCrew } from "./Ship";
import { visitVendor } from "./Vendor";
import type { Rl } from "../types/Rl";
import { visitDocks, WorldGraph } from "./WorldGraph";
import { GameOverError, type GameOverReason } from "./GameOver";
import { computeFinalScore, printScoreBreakdown, type ScoreBreakdown } from "./Score";

const MAIN_MENU_ALIASES: AliasMap = {
    'S': 'View Ship',
    'C': 'View Cargo',
    'D': 'Visit Docks',
    'V': 'Visit Vendor',
    'H': 'Hire Crew',
    'X': 'Exit',
    'E': 'Exit',
};
export default class GameManager {
    private _duration: number;
    private _maxDays: number;
    private _player: Player;
    private _exitGame: boolean;
    private _state: GameState;
    private _rl: Rl;
    private _worldGraph: WorldGraph;

    constructor(duration: number, player: Player, rl: Rl) {
        this._duration = duration;
        this._maxDays = duration;
        this._player = player;
        this._exitGame = false;
        this._state = 'At Island';
        this._rl = rl;
        this._worldGraph = new WorldGraph();
    }

    get daysRemaining(): number {
        return this._duration;
    }

    get maxDays(): number {
        return this._maxDays;
    }

    set daysRemaining(daysRemaining: number) {
        if (daysRemaining < 0) {
            this._duration = 0;
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

    beginGame() {
        return this.run();
    }

    async promptPlayer(): Promise<GameState> {
        resetCompletions();
        this.printCommands();
        const playerResponse = await prompt(this._rl, 'What would ye like to do?');
        const formatted = formatCommand(playerResponse);
        return expandAlias(formatted, MAIN_MENU_ALIASES) as GameState;
    }

    printCommands() {
        printHeader(`${this._player.islandName} - Day ${this.maxDays - this.daysRemaining + 1} of ${this.maxDays}`);
        console.log(`Balance: ${this._player.balance} Doubloons   Days remaining: ${this.daysRemaining}`);
        console.log('');
        console.log('Available Commands:');
        for (const cmd of MAIN_MENU_COMMANDS) {
            const alias = Object.entries(MAIN_MENU_ALIASES).find(([, v]) => v === cmd)?.[0];
            console.log(alias ? `  [${alias}] ${cmd}` : `  ${cmd}`);
        }
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
        const score = computeFinalScore(this._player, this);
        printEndOfGameInformation(reason, score);
        this._exitGame = true;
        this._rl.close();
        await waitForKeypress();
        return 'Exit';
    }
}

function waitForKeypress(): Promise<void> {
    return new Promise(resolve => {
        process.stdout.write('\nPress any key to exit...');
        if (process.stdin.isTTY) {
            process.stdin.setRawMode(true);
        }
        process.stdin.resume();
        process.stdin.once('data', () => {
            if (process.stdin.isTTY) {
                process.stdin.setRawMode(false);
            }
            process.stdin.pause();
            resolve();
        });
    });
}

function printEndOfGameInformation(reason: GameOverReason, score: ScoreBreakdown) {
    switch (reason) {
        case 'Selected Exit':
            console.log('Ye laid down yer sword. The voyage ends here.');
            break;
        case 'Combat':
            console.log('Ye fell in glorious battle. The sea claims another captain.');
            break;
        case 'Time':
            console.log('The trading season be over. Yer voyage be done.');
            break;
        case 'Weather':
            console.log('The storm swallowed ye whole. Davy Jones be pleased with his prize.');
            break;
        case 'Stranded':
            console.log('Marooned and forgotten, ye perished alone on the open sea.');
            break;
    }

    printScoreBreakdown(score);
}