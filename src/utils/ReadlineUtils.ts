import { stdin, stdout } from "process";
import { createInterface, type Completer, type ReadLineOptions } from "node:readline";
import type { Rl } from "../types/Rl";


export function constructReadline(completerFunction?: Completer): Rl {
    const rlConstructor: ReadLineOptions = {
        input: stdin,
        output: stdout,
    }

    if (completerFunction) rlConstructor.completer = completerFunction;

    return createInterface(rlConstructor);
}