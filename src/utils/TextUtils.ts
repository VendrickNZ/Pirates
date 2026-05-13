import type { CompleterResult } from "readline";
import type { Rl } from "../types/Rl";

const MIN_GAME_DURATION = 20;
const MAX_GAME_DURATION = 50;

export const MAIN_MENU_COMMANDS = ['View Ship', 'View Cargo', 'Visit Docks', 'Visit Vendor', 'Hire Crew', 'Exit'];

let activeCompletions: string[] = MAIN_MENU_COMMANDS;

export function setCompletions(commands: string[]): void {
    activeCompletions = commands;
}

export function resetCompletions(): void {
    activeCompletions = MAIN_MENU_COMMANDS;
}

export function completer(line: string): CompleterResult {
    const formattedLine = formatCommand(line);
    const hits = activeCompletions.filter(c => c.startsWith(formattedLine));
    return [hits.length ? hits : activeCompletions, formattedLine];
}

export type AliasMap = Record<string, string>;

export function expandAlias(input: string, aliases: AliasMap): string {
    return aliases[input] ?? input;
}

export function prompt(rl: Rl, label?: string): Promise<string> {
    if (label) console.log(label);
    return new Promise(resolve => rl.question('> ', resolve));
}

export function printHeader(title: string): void {
    console.log('');
    console.log(`===== ${title} =====`);
}

export function printInformation(toPrint: string, spacing: number = 0): void {
    console.log(newLine(spacing))
    console.log(toPrint);
    console.log(newLine(spacing))
}

export async function narrate(text: string, delayMs: number = 1200): Promise<void> {
    console.log(text);
    await sleepInMs(delayMs);
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