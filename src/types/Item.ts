export type ItemType = 'Food' | 'Weapon' | 'Luxury' | 'Natural Resource' | 'Alcohol' | 'Common' | 'Medicine'

export type Item = {
    id: number,
    name: string,
    type: ItemType,
    baseValue: number,
    weight: number,
    units: number
}

export type ItemList = Item[]

export const GameItems: Item[] = [
    { id: 1, name: "Barrel of Rum", type: "Alcohol", baseValue: 30.0, weight: 5, units: 1 },
    { id: 2, name: "Barrel of Wine", type: "Alcohol", baseValue: 35.0, weight: 5, units: 1 },
    { id: 3, name: "Barrel of Mead", type: "Alcohol", baseValue: 26.0, weight: 5, units: 1 },
    { id: 4, name: "Crate of Rum", type: "Alcohol", baseValue: 10.0, weight: 5, units: 1 },
    { id: 5, name: "Crate of Wine", type: "Alcohol", baseValue: 10.4, weight: 2, units: 1 },
    { id: 6, name: "Crate of Mead", type: "Alcohol", baseValue: 9.8, weight: 2, units: 1 },

    { id: 7, name: "Silver Plates", type: "Luxury", baseValue: 50.0, weight: 3, units: 1 },
    { id: 8, name: "Marble Statues", type: "Luxury", baseValue: 47.6, weight: 7, units: 1 },
    { id: 9, name: "Bronze Bull", type: "Luxury", baseValue: 70.0, weight: 20, units: 1 },
    { id: 10, name: "Crate of Tobacco", type: "Luxury", baseValue: 47.0, weight: 3, units: 1 },
    { id: 11, name: "Pipeweed", type: "Luxury", baseValue: 29.4, weight: 2, units: 1 },
    { id: 12, name: "Mystery Crate", type: "Luxury", baseValue: 116.0, weight: 5, units: 1 },
    { id: 13, name: "Box of Nutmeg", type: "Luxury", baseValue: 26.0, weight: 2, units: 1 },
    { id: 14, name: "Box of Cinnamon", type: "Luxury", baseValue: 26.0, weight: 2, units: 1 },
    { id: 15, name: "Box of Ginger", type: "Luxury", baseValue: 26.0, weight: 2, units: 1 },
    { id: 16, name: "Box of Turmeric", type: "Luxury", baseValue: 26.0, weight: 2, units: 1 },
    { id: 17, name: "Rolls of Silk", type: "Luxury", baseValue: 50.0, weight: 5, units: 1 },
    { id: 18, name: "Ivory Chest", type: "Luxury", baseValue: 71.2, weight: 7, units: 1 },
    { id: 19, name: "Religious Sculpture", type: "Luxury", baseValue: 17.0, weight: 3, units: 1 },
    { id: 20, name: "Incense", type: "Luxury", baseValue: 25.0, weight: 3, units: 1 },

    { id: 21, name: "Iron Ore", type: "Natural Resource", baseValue: 5.0, weight: 5, units: 1 },
    { id: 22, name: "Coal Ore", type: "Natural Resource", baseValue: 4.6, weight: 4, units: 1 },
    { id: 23, name: "Timber", type: "Natural Resource", baseValue: 5.4, weight: 3, units: 1 },
    { id: 24, name: "Charcoal", type: "Natural Resource", baseValue: 3.4, weight: 1, units: 1 },
    { id: 25, name: "Quarried Stone", type: "Natural Resource", baseValue: 15.4, weight: 7, units: 1 },

    { id: 26, name: "Scimitar", type: "Weapon", baseValue: 18.0, weight: 3, units: 1 },
    { id: 27, name: "Muskets", type: "Weapon", baseValue: 16.0, weight: 4, units: 1 },
    { id: 28, name: "Flintlock Pistols", type: "Weapon", baseValue: 14.0, weight: 3, units: 1 },
    { id: 29, name: "Musket Rounds", type: "Weapon", baseValue: 4.6, weight: 2, units: 1 },

    { id: 30, name: "Crate of Oranges", type: "Food", baseValue: 10.0, weight: 6, units: 1 },
    { id: 31, name: "Crate of Lemons", type: "Food", baseValue: 10.0, weight: 6, units: 1 },
    { id: 32, name: "Cabbages", type: "Food", baseValue: 9.0, weight: 3, units: 1 },
    { id: 33, name: "Crate of Wheat", type: "Food", baseValue: 4.6, weight: 4, units: 1 },
    { id: 34, name: "Barrel of Grain", type: "Food", baseValue: 4.6, weight: 4, units: 1 },
    { id: 35, name: "Sack of Rice", type: "Food", baseValue: 4.6, weight: 4, units: 1 },
    { id: 36, name: "Salted Pork", type: "Food", baseValue: 8.6, weight: 3, units: 1 },
    { id: 37, name: "Salted Salmon", type: "Food", baseValue: 7.9, weight: 2, units: 1 },
    { id: 38, name: "Bundle of Parsley", type: "Food", baseValue: 4.6, weight: 1, units: 1 },
    { id: 39, name: "Bundle of Chives", type: "Food", baseValue: 4.6, weight: 1, units: 1 },
    { id: 40, name: "Bundle of Mint", type: "Food", baseValue: 4.6, weight: 1, units: 1 },
    { id: 41, name: "Bundle of Basil", type: "Food", baseValue: 5.0, weight: 1, units: 1 },
    { id: 42, name: "Sack of Potatoes", type: "Food", baseValue: 4.8, weight: 4, units: 1 },
    { id: 43, name: "Week Old Pizza", type: "Food", baseValue: 2.0, weight: 1, units: 1 },

    { id: 44, name: "Medicinal Herbs", type: "Medicine", baseValue: 13.0, weight: 2, units: 1 },
    { id: 45, name: "Crate of Lemons", type: "Medicine", baseValue: 12.0, weight: 5, units: 1 },
    { id: 46, name: "Crate of Oranges", type: "Medicine", baseValue: 12.0, weight: 5, units: 1 },

    { id: 47, name: "Bundle of Rope", type: "Common", baseValue: 2.4, weight: 2, units: 1 },
    { id: 48, name: "Crate of Nails", type: "Common", baseValue: 4.2, weight: 3, units: 1 },
    { id: 49, name: "Mystery Crate", type: "Common", baseValue: 3.4, weight: 3, units: 1 },
    { id: 50, name: "Cheap Rugs", type: "Common", baseValue: 9.4, weight: 2, units: 1 },
    { id: 51, name: "Pottery", type: "Common", baseValue: 8.6, weight: 3, units: 1 },
    { id: 52, name: "Wooden Chairs", type: "Common", baseValue: 10.8, weight: 6, units: 1 },
    { id: 53, name: "Wooden Tables", type: "Common", baseValue: 13.3, weight: 8, units: 1 }
];

// i need to get a random one
export function getItemsOfType(type: ItemType, n: number = 10) {
    const itemList = [];
    const items = GameItems.filter(i => i.type == type);
    for (let i = 0; i < n; ++i) {
        itemList.push(items[getRandomInt(items)])
    }
    return itemList;
}

export function getItems(n: number = 10) {
    const itemList: Item[] = [];
    for (let i = 0; i < n; ++i) {
        const item = GameItems[getRandomInt(GameItems)]
        if (itemList.includes(item)) {
            item.units += 1
        } else {
            itemList.push(item)
        }
    }
    return itemList;
}
function getRandomInt(items: Item[]) {
    const minCeiled = Math.ceil(0);
    const maxFloored = Math.floor(items.length - 1);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}