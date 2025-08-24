import { exit, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import Player from "../models/Player";
import GameManager from "../models/GameManager";

export async function createNewGame() {
    const rl = createInterface({
        input: stdin,
        output: stdout,
    });

    const name = await rl.question('Enter player name (3-15 characters, letters and spaces only): ');
    const duration = await rl.question('How many days do you want the game to last (20-50)?: ')
    const seed = await rl.question('Enter a world seed (optional): ');

    rl.write('Intro text...\n');
    rl.close();

    const player = createPlayer(name);

    const gm = new GameManager(parseInt(duration), parseInt(seed), player);
    gm.printAvailableCommands();
}

function createPlayer(name: string): Player {

    const player = new Player(name);
    return player;
}