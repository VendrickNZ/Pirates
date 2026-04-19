import { ItemTypes, type ItemType } from "../types/Item";
import { getRandomFloat, getRandomInt } from "../utils/NumberUtils";
import { Vendor } from "./Vendor";

const MAX_COORDINATE = 1000;
const MIN_COORDINATE = -1000;

type IslandNames = 'Barataria Bay' | 'Port Royal' | 'Tortuga' | 'Prince Edward Island'
export type IslandCommoditiesTable = Record<ItemType, number>;
export type IslandLocationVector2 = [number, number];
export type IslandId = number;

export type Island = {
    id: IslandId;

    name: IslandNames;

    /** What modifiers to apply to item types */
    commodityMultipliers: IslandCommoditiesTable;

    /** Coordinates for XY position on world map */
    location: IslandLocationVector2;

    /** The given Islands vendor */
    vendor: Vendor;
}

function generateLocation(): IslandLocationVector2 {
    const x = getRandomInt(MIN_COORDINATE, MAX_COORDINATE);
    const y = getRandomInt(MIN_COORDINATE, MAX_COORDINATE);

    const roundedX = parseInt(x.toFixed(0));
    const roundedY = parseInt(y.toFixed(0));

    return [roundedX, roundedY];
}

function createIsland(id: IslandId, name: IslandNames): Island {
    const commodityMultipliers = generateCommodityMultipliers();
    return {
        id,
        name,
        commodityMultipliers,
        location: generateLocation(),
        vendor: new Vendor(commodityMultipliers)
    }
}

let islands: Island[] | null = null;

function generateCommodityMultipliers() {
    const commodityMultiplier: IslandCommoditiesTable = {};
    for (const type of ItemTypes) {
        commodityMultiplier[type] = getRandomFloat(0.25, 2, 2); 
    }
    return commodityMultiplier;
}

export function getIslands(): Island[] {
    if (!islands) {
        islands = [
            createIsland(1, 'Barataria Bay'),
            createIsland(2, 'Port Royal'),
            createIsland(3, 'Tortuga'),
            createIsland(4, 'Prince Edward Island')
        ];
    }
    return islands;
}

/** The starting island of Port Royal */
export function getStartingIsland(): Island {
    const islands = getIslands();
    return islands.find(d => d.name === 'Port Royal')!;
}
