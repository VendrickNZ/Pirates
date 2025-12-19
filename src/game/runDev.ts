import { createNewGame } from "./GameSetup";

export function runDev() {
    createNewGame(devConfigs);
}

const devConfigs = {
    name: 'Jakib',
    duration: 50,
    worldSeed: 1
}

export type DevConfigs = typeof devConfigs;