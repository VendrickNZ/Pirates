import { Interface } from "node:readline/promises";
import Player from "../models/Player";
import GameManager from "../models/GameManager";
import { completer, isValidGameDuration, isValidPlayerName, printInformation } from "../utils/TextUtils";
import { constructReadline } from "../utils/ReadlineUtils";
import type { DevConfigs } from "./runDev";

export async function createNewGame(configs?: DevConfigs) {
    const rl = constructReadline(completer);

    if (configs) {
        const { duration, name } = configs;
        const player = createPlayer(name);
        const gm = new GameManager(duration, player, rl);
        gm.beginGame();
        return;
    }

    const name = await promptPlayerName(rl);
    const duration = await promptGameDuration(rl);

    printInformation(`Ahoy, Captain ${name}! Ye've taken command o' the Victoria - a humble vessel with naught but ${duration} days afore the trading season ends.\nTrade, plunder, or chase the horizon - make yer fortune afore the tides turn. Good luck, ye scurvy dog!`)

    const player = createPlayer(name);
    const gm = new GameManager(duration, player, rl);
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