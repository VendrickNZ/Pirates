import { stdin, stdout } from "node:process";
import { createInterface, Interface } from "node:readline/promises";
import Player from "../models/Player";
import GameManager from "../models/GameManager";
import { isValidGameDuration, isValidPlayerName, isValidWorldSeed, printInformation } from "../utils/TextUtils";

export async function createNewGame() {
    const rl = createInterface({
        input: stdin,
        output: stdout,
    });
    const name = await promptPlayerName(rl);
    const duration = await promptGameDuration(rl);
    const worldSeed = await promptWorldSeed(rl);
    rl.close();

    printInformation('Intro text...')

    const player = createPlayer(name);

    const gm = new GameManager(duration, worldSeed, player);
    gm.printAvailableCommands();
}

function createPlayer(name: string): Player {


    const player = new Player(name);
    return player;
}

async function promptPlayerName(rl: Interface): Promise<string> {
    const name = await rl.question('Enter player name (3-15 characters, letters and spaces only): ');

    if (!isValidPlayerName(name)) {
        rl.write(`${name} is invalid, please try again. \n`)
        return promptPlayerName(rl);
    } else {
        return name;
    }
}

async function promptGameDuration(rl: Interface): Promise<number> {
    const duration = await rl.question('How many days do you want the game to last (20-50)?: ');

    if (!isValidGameDuration(duration)) {
        rl.write(`${duration} is invalid, please try again. \n`)
        return promptGameDuration(rl);
    } else {
        return parseInt(duration);
    }
}

async function promptWorldSeed(rl: Interface): Promise<number> {
    const seed = await rl.question('Enter a world seed (optional): ');

    if (!isValidWorldSeed(seed)) {
        rl.write(`${seed} is invalid, please try again. \n`)
        return promptWorldSeed(rl);
    } else {
        return parseInt(seed);
    }
}