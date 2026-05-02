import { createNewGame } from "./GameSetup";

export function runDev() {
    createNewGame(devConfigs);
}

const devConfigs = {
    name: 'Jakib',
    duration: 50
}

export type DevConfigs = typeof devConfigs;