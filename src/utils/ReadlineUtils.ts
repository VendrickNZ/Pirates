import { stdin, stdout } from "process";
import { createInterface, Interface, type Completer, type ReadLineOptions } from "readline/promises";


export function constructReadline(completerFunction?: Completer): Interface{
    const rlConstructor: ReadLineOptions = {
        input: stdin,
        output: stdout,
    }

    if (completerFunction) rlConstructor.completer = completerFunction;

    return createInterface(rlConstructor);
}