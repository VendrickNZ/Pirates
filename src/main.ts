import runCLI from "./runCLI.js";
import runGUI from "./runGUI.js";

console.log('hello world');

if (process.argv[2] == 'nogui') {
  runCLI();
} else {
  runGUI();
}
