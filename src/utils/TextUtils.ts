import type { CompleterResult } from "readline";

const MIN_GAME_DURATION = 20;
const MAX_GAME_DURATION = 50;

export function completer(line: string): CompleterResult {
    const completions = ['View Ship', 'View Cargo', 'Visit Dock', 'View Vendor', 'Hire Crew', 'Exit'];
    const formattedLine = formatCommand(line);
    const hits = completions.filter(c => c.startsWith(formattedLine));

    return [hits.length ? hits : completions, formattedLine];
}

export function printInformation(toPrint: string): void {
    console.log('\n');
    console.log(toPrint);
    console.log('\n');
}

function filterOutWhiteSpace(command: string[]): string[] {
    return command.filter(w => w != '');
}
export function formatCommand(command: string): string {
    const trimmedWords = filterOutWhiteSpace(command.trim().split(' '));
    const commandInTitleCase = trimmedWords.map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    return commandInTitleCase;
}

export function TimeoutInSeconds(seconds: number): Promise<NodeJS.Timeout> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000)) // timeout uses milliseconds
}

export function isValidPlayerName(name: string): boolean {
    const regex = new RegExp('^[a-zA-Z ]{3,15}$');
    return regex.test(name);
}

export function isValidGameDuration(durationString: string): boolean {
    if (isNumber(durationString)) {
        const duration = parseInt(durationString);
        return (duration >= MIN_GAME_DURATION) && (duration <= MAX_GAME_DURATION);
    }
    return false;
}

export function isValidWorldSeed(worldSeed: string) {
    // TODO: implement properly
    return true ? worldSeed.length == 0 || isNumber(worldSeed) : false;
}

// https://stackoverflow.com/questions/23437476/in-typescript-how-to-check-if-a-string-is-numeric
export function isNumber(value?: string | number): boolean {
    return ((value != null)
        && (value != '')
        && !isNaN(Number(value.toString())));
}