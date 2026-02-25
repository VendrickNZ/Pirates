export type ItemType = 'Food' | 'Weapon' | 'Luxury' | 'Natural Resource' | 'Alcohol' | 'Common' | 'Medicine'

export type Item = {
    readonly id: number,
    readonly name: string,
    readonly type: ItemType,
    readonly baseValue: number,
    currentValue: number,
    readonly weight: number,
    units: number;
}

export type Inventory = ItemReference[]

export interface ItemReference {
    readonly id: number;
    units: number;
}

export const GameItems: Item[] = [
    { id: 1, name: "Barrel of Rum", type: "Alcohol", baseValue: 30.0, currentValue: 30.0, weight: 5, units: 0 },
    { id: 2, name: "Barrel of Wine", type: "Alcohol", baseValue: 35.0, currentValue: 35.0, weight: 5, units: 0 },
    { id: 3, name: "Barrel of Mead", type: "Alcohol", baseValue: 26.0, currentValue: 26.0, weight: 5, units: 0 },
    { id: 4, name: "Crate of Rum", type: "Alcohol", baseValue: 10.0, currentValue: 10.0, weight: 5, units: 0 },
    { id: 5, name: "Crate of Wine", type: "Alcohol", baseValue: 10.4, currentValue: 10.4, weight: 2, units: 0 },
    { id: 6, name: "Crate of Mead", type: "Alcohol", baseValue: 9.8, currentValue: 9.8, weight: 2, units: 0 },

    { id: 7, name: "Silver Plates", type: "Luxury", baseValue: 50.0, currentValue: 50.0, weight: 3, units: 0 },
    { id: 8, name: "Marble Statues", type: "Luxury", baseValue: 47.6, currentValue: 47.6, weight: 7, units: 0 },
    { id: 9, name: "Bronze Bull", type: "Luxury", baseValue: 70.0, currentValue: 70.0, weight: 20, units: 0 },
    { id: 10, name: "Crate of Tobacco", type: "Luxury", baseValue: 47.0, currentValue: 47.0, weight: 3, units: 0 },
    { id: 11, name: "Pipeweed", type: "Luxury", baseValue: 29.4, currentValue: 29.4, weight: 2, units: 0 },
    { id: 12, name: "Mystery Crate", type: "Luxury", baseValue: 116.0, currentValue: 116.0, weight: 5, units: 0 },
    { id: 13, name: "Box of Nutmeg", type: "Luxury", baseValue: 26.0, currentValue: 26.0, weight: 2, units: 0 },
    { id: 14, name: "Box of Cinnamon", type: "Luxury", baseValue: 26.0, currentValue: 26.0, weight: 2, units: 0 },
    { id: 15, name: "Box of Ginger", type: "Luxury", baseValue: 26.0, currentValue: 26.0, weight: 2, units: 0 },
    { id: 16, name: "Box of Turmeric", type: "Luxury", baseValue: 26.0, currentValue: 26.0, weight: 2, units: 0 },
    { id: 17, name: "Rolls of Silk", type: "Luxury", baseValue: 50.0, currentValue: 50.0, weight: 5, units: 0 },
    { id: 18, name: "Ivory Chest", type: "Luxury", baseValue: 71.2, currentValue: 71.2, weight: 7, units: 0 },
    { id: 19, name: "Religious Sculpture", type: "Luxury", baseValue: 17.0, currentValue: 17.0, weight: 3, units: 0 },
    { id: 20, name: "Incense", type: "Luxury", baseValue: 25.0, currentValue: 25.0, weight: 3, units: 0 },

    { id: 21, name: "Iron Ore", type: "Natural Resource", baseValue: 5.0, currentValue: 5.0, weight: 5, units: 0 },
    { id: 22, name: "Coal Ore", type: "Natural Resource", baseValue: 4.6, currentValue: 4.6, weight: 4, units: 0 },
    { id: 23, name: "Timber", type: "Natural Resource", baseValue: 5.4, currentValue: 5.4, weight: 3, units: 0 },
    { id: 24, name: "Charcoal", type: "Natural Resource", baseValue: 3.4, currentValue: 3.4, weight: 1, units: 0 },
    { id: 25, name: "Quarried Stone", type: "Natural Resource", baseValue: 15.4, currentValue: 15.4, weight: 7, units: 0 },

    { id: 26, name: "Scimitar", type: "Weapon", baseValue: 18.0, currentValue: 18.0, weight: 3, units: 0 },
    { id: 27, name: "Muskets", type: "Weapon", baseValue: 16.0, currentValue: 16.0, weight: 4, units: 0 },
    { id: 28, name: "Flintlock Pistols", type: "Weapon", baseValue: 14.0, currentValue: 14.0, weight: 3, units: 0 },
    { id: 29, name: "Musket Rounds", type: "Weapon", baseValue: 4.6, currentValue: 4.6, weight: 2, units: 0 },

    { id: 30, name: "Crate of Oranges", type: "Food", baseValue: 10.0, currentValue: 10.0, weight: 6, units: 0 },
    { id: 31, name: "Crate of Lemons", type: "Food", baseValue: 10.0, currentValue: 10.0, weight: 6, units: 0 },
    { id: 32, name: "Cabbages", type: "Food", baseValue: 9.0, currentValue: 9.0, weight: 3, units: 0 },
    { id: 33, name: "Crate of Wheat", type: "Food", baseValue: 4.6, currentValue: 4.6, weight: 4, units: 0 },
    { id: 34, name: "Barrel of Grain", type: "Food", baseValue: 4.6, currentValue: 4.6, weight: 4, units: 0 },
    { id: 35, name: "Sack of Rice", type: "Food", baseValue: 4.6, currentValue: 4.6, weight: 4, units: 0 },
    { id: 36, name: "Salted Pork", type: "Food", baseValue: 8.6, currentValue: 8.6, weight: 3, units: 0 },
    { id: 37, name: "Salted Salmon", type: "Food", baseValue: 7.9, currentValue: 7.9, weight: 2, units: 0 },
    { id: 38, name: "Bundle of Parsley", type: "Food", baseValue: 4.6, currentValue: 4.6, weight: 1, units: 0 },
    { id: 39, name: "Bundle of Chives", type: "Food", baseValue: 4.6, currentValue: 4.6, weight: 1, units: 0 },
    { id: 40, name: "Bundle of Mint", type: "Food", baseValue: 4.6, currentValue: 4.6, weight: 1, units: 0 },
    { id: 41, name: "Bundle of Basil", type: "Food", baseValue: 5.0, currentValue: 5.0, weight: 1, units: 0 },
    { id: 42, name: "Sack of Potatoes", type: "Food", baseValue: 4.8, currentValue: 4.8, weight: 4, units: 0 },
    { id: 43, name: "Week Old Pizza", type: "Food", baseValue: 2.0, currentValue: 2.0, weight: 1, units: 0 },

    { id: 44, name: "Medicinal Herbs", type: "Medicine", baseValue: 13.0, currentValue: 13.0, weight: 2, units: 0 },
    { id: 45, name: "Crate of Lemons", type: "Medicine", baseValue: 12.0, currentValue: 12.0, weight: 5, units: 0 },
    { id: 46, name: "Crate of Oranges", type: "Medicine", baseValue: 12.0, currentValue: 12.0, weight: 5, units: 0 },

    { id: 47, name: "Bundle of Rope", type: "Common", baseValue: 2.4, currentValue: 2.4, weight: 2, units: 0 },
    { id: 48, name: "Crate of Nails", type: "Common", baseValue: 4.2, currentValue: 4.2, weight: 3, units: 0 },
    { id: 49, name: "Mystery Crate", type: "Common", baseValue: 3.4, currentValue: 3.4, weight: 3, units: 0 },
    { id: 50, name: "Cheap Rugs", type: "Common", baseValue: 9.4, currentValue: 9.4, weight: 2, units: 0 },
    { id: 51, name: "Pottery", type: "Common", baseValue: 8.6, currentValue: 8.6, weight: 3, units: 0 },
    { id: 52, name: "Wooden Chairs", type: "Common", baseValue: 10.8, currentValue: 10.8, weight: 6, units: 0 },
    { id: 53, name: "Wooden Tables", type: "Common", baseValue: 13.3, currentValue: 13.3, weight: 8, units: 0 }
];

export function getItems(n: number = 10): ItemReference[] {
    const itemList: ItemReference[] = [];
    for (let i = 0; i < n; ++i) {
        const item = GameItems[getRandomInt(GameItems)];
        item.units++;

        const itemInStack = itemList.find(x => x.id == item.id);

        if (itemInStack) {
            itemInStack.units++;
            continue;
        }

        const newStackItem: ItemReference = { id: item.id, units: 1 };
        itemList.push(newStackItem);
    }
    return itemList;
}
function getRandomInt(items: Item[]) {
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(items.length - 1);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}