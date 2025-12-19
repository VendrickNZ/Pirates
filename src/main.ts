import runCLI from "./game/runCLI";
import { runDev } from "./game/runDev";
import runGUI from "./game/runGUI";

switch (process.argv[2]) {
  case 'nogui':
    runCLI();
    break;
  case 'gui':
    runGUI();
    break;
  default:
    runDev();
}