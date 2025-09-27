type DockNames = 'Barataria Bay' | 'Port Royal' | 'Tortuga'
export type Dock = Record<string, DockNames>;

const docks: Dock[] = [
    {
        "name": "Barataria Bay"
    },
    {
        "name": "Port Royal"
    },
    {
        "name": "Tortuga"
    }
]

export function getDocks(): Dock[] {
    return docks;
}

export function getStartingDock(): Dock {
    const docks = getDocks()
    return docks.find(d => d.name == 'Port Royal')!;
}

