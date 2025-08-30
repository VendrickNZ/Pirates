import type { CompleterResult } from "readline";

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