process.removeAllListeners('warning');

import runCLI from "./game/runCLI";

runCLI().catch(e => { console.error(e); process.exit(1); });