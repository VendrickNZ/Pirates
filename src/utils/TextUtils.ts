import type { CompleterResult } from "readline";

const MIN_GAME_DURATION = 20;
const MAX_GAME_DURATION = 50;

export function completer(line: string): CompleterResult {
    const completions = ['View Ship', 'View Cargo', 'Visit Docks', 'Visit Vendor', 'Hire Crew', 'Exit'];
    const formattedLine = formatCommand(line);
    const hits = completions.filter(c => c.startsWith(formattedLine));

    return [hits.length ? hits : completions, formattedLine];
}

export function printInformation(toPrint: string, spacing: number = 0): void {
    console.log(newLine(spacing))
    console.log(toPrint);
    console.log(newLine(spacing))
}

export async function printInformationWithDelay(toPrint: string, spacing: number = 1, delayInSeconds: number = 1): Promise<void> {
    console.log(newLine(spacing))
    console.log(toPrint);
    console.log(newLine(spacing))
    await timeoutInSeconds(delayInSeconds);
}

export function newLine(n: number) {
    return '\n'.repeat(n);
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

export function timeoutInSeconds(seconds: number): Promise<NodeJS.Timeout> {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000)) // timeout uses milliseconds
}

export function isValidPlayerName(name: string): boolean {
    const regex = new RegExp('^[a-zA-Z ]{3,15}$');
    return regex.test(name);
}

// https://stackoverflow.com/questions/23437476/in-typescript-how-to-check-if-a-string-is-numeric
export function isNumber(value?: string | number): boolean {
    return ((value != null)
        && (value != '')
        && !isNaN(Number(value.toString())));
}

export function isValidGameDuration(durationString: string): boolean {
    if (isNumber(durationString)) {
        const duration = parseInt(durationString);
        return (duration >= MIN_GAME_DURATION) && (duration <= MAX_GAME_DURATION);
    }
    return false;
}

export function formatFloat(number: number, dp = 1) {
    return parseFloat(number.toFixed(dp));
}

export function sleepInMs(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}