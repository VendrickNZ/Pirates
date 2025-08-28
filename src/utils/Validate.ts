export default function formatCommand(command: string) {
    const trimmedWords = filterOutWhiteSpace(command.trim().split(' '));
    const commandInTitleCase = trimmedWords.map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
    return commandInTitleCase;
}

function filterOutWhiteSpace(command: string[]) {
    return command.filter(w => w != '');
}