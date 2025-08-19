import { exit, stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import Player from "./Player";
import GameManager from "./GameManager";

export async function createNewGame() {
    const rl = createInterface({
        input: stdin,
        output: stdout,
    });

    const name = await rl.question('Enter player name (3-15 characters, letters and spaces only): ');
    const duration = await rl.question('How many days do you want the game to last (20-50)?: ')
    const seed = await rl.question('Enter a world seed (optional): ');

    const player = new Player(name);
    const gm = new GameManager(parseInt(duration), parseInt(seed));
    
    console.log('Welcome to Pirates!', player.getName());

}