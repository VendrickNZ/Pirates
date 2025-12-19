import { Interface } from "node:readline/promises";
import Player from "../models/Player";
import GameManager from "../models/GameManager";
import { completer, isValidGameDuration, isValidPlayerName, isValidWorldSeed, printInformation } from "../utils/TextUtils";
import { constructReadline } from "../utils/ReadlineUtils";
import type { DevConfigs } from "./runDev";

export async function createNewGame(configs?: DevConfigs) {
    const rl = constructReadline(completer);

    if (configs) {
        const { duration, worldSeed, name } = configs;
        const player = createPlayer(name);
        const gm = new GameManager(duration, worldSeed, player, rl);
        gm.beginGame();
        return;
    }

    const name = await promptPlayerName(rl);
    const duration = await promptGameDuration(rl);
    const worldSeed = await promptWorldSeed(rl);

    printInformation('Intro text...')

    const player = createPlayer(name);
    const gm = new GameManager(duration, worldSeed, player, rl);
    gm.beginGame();
}

function createPlayer(name: string): Player {
    return new Player(name);
}

async function promptPlayerName(rl: Interface): Promise<string> {
    const name = await rl.question('Enter player name (3-15 characters, letters and spaces only): ');

    if (!isValidPlayerName(name)) {
        console.log(`${name} is invalid, please try again. \n`)
        return promptPlayerName(rl);
    } else {
        return name;
    }
}

async function promptGameDuration(rl: Interface): Promise<number> {
    const duration = await rl.question('How many days do you want the game to last (20-50)?: ');

    if (!isValidGameDuration(duration)) {
        console.log(`${duration} is invalid, please try again. \n`)
        return promptGameDuration(rl);
    } else {
        return parseInt(duration);
    }
}

async function promptWorldSeed(rl: Interface): Promise<number> {
    const seed = await rl.question('Enter a world seed (optional): ');

    if (!isValidWorldSeed(seed)) {
        console.log(`${seed} is invalid, please try again. \n`)
        return promptWorldSeed(rl);
    } else {
        return parseInt(seed);
    }
}