import runCLI from "./game/runCLI";
import { runDev } from "./game/runDev";

switch (process.argv[2]) {
  case 'nogui':
    runCLI();
    break;
  default:
    runDev();
}