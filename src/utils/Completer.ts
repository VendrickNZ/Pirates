import type { CompleterResult } from "readline";
import formatCommand from "./Validate";

export default function completer(line: string): CompleterResult {
    const completions = ['View Ship', 'View Cargo', 'Visit Dock', 'View Vendor', 'Hire Crew', 'Exit'];
    const formattedLine = formatCommand(line);
    const hits = completions.filter(c => c.startsWith(formattedLine));

    return [hits.length ? hits : completions, formattedLine];
}