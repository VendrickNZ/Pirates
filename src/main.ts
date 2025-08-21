import runCLI from "./game/runCLI";
import runGUI from "./game/runGUI";

if (process.argv[2] == 'nogui') {
  runCLI();
} else {
  runGUI();
}
