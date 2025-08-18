import runCLI from "./runCLI";
import runGUI from "./runGUI";

if (process.argv[2] == 'nogui') {
  runCLI();
} else {
  runGUI();
}
