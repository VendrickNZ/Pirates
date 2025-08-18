import { exit, stdin, stdout } from "node:process";
import { createInterface, Interface } from "node:readline";
import Player from "./Player";

export default function runCLI() {
    cliTest();
}


function cliTest() {
    
    const rl = createInterface({
        input: stdin,
        output: stdout,
        prompt: '> '
    });
    rl.question('Enter player name (3-15 characters, letters and spaces only): ', (name) => {
        const test = new Player(name);
        console.log(test.getName());
    });

    //     Enter player name (3-15 characters, letters and spaces only):
    // How many days do you want the game to last (20-50)?:
    // Enter a world seed (optional):

    rl.on('line', (line) => {
        switch (line.trim()) {
            case 'hello':
                console.log('world!');
                break;
            case 'exit':
                rl.close();
                break;
            default:
                console.log(`Say what? I might have heard '${line.trim()}'`);
                break;
        }
        rl.prompt();

    }).on('close', () => {
        console.log('I am dead');
        exit(0);
    })
}

function startingQuestions() {

}