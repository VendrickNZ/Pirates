import type { Dictionary } from './Generic';
import jsonDocks from './resources/locations.json'

export type Dock = {
    name: string
}

export type Docks = Dictionary<Dock>;

export function getDocks(): Docks {
    const locations = Object.fromEntries(
        jsonDocks.locations.map(l => [l.name, l])
    );
    return locations;
}

export function getStartingDock(): Dock {
    const docks = getDocks()
    return docks["Port Royal"];
}