import jsonDocks from './resources/locations.json'

export function getDocks() {
    const locations = Object.fromEntries(
        jsonDocks.locations.map(l => [l.name, l])
    );
    return locations;
}
