import jsonDocks from '../resources/locations.json'
import type { Docks, Dock } from '../models/Dock';

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