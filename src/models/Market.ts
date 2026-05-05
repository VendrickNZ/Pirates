import Player from "./Player";
import { getIslands, type IslandCommoditiesTable } from "./Island";
import { formatFloat } from "../utils/TextUtils";
import type { Item } from "../types/Item";

export function getMonopolyMultiplier(itemId: number, player: Player) {
    const islands = getIslands();
    const vendorTotal = islands.reduce((total, island) => {
        const item = island.vendor.inventory.find(x => x.id === itemId);
        return total + (item?.units ?? 0);
    }, 0)

    const playerTotal = player.ship.cargo.inventory.find(x => x.id === itemId)?.units ?? 0;

    const worldTotal = vendorTotal + playerTotal;

    if (worldTotal === 0) return 1;

    const playerOwnPercentage = formatFloat(playerTotal / worldTotal, 6);
    const monopolyMultiplier = applyItemMonopolyMultiplierFunction(playerOwnPercentage);
    
    return monopolyMultiplier;
}

function applyItemMonopolyMultiplierFunction(marketShare: number) {
    return (1 + 2*marketShare) ** 1.5;
}

export function recomputePrices(item: Item, multipliers: IslandCommoditiesTable, player: Player) {
    const commodityMultiplier = multipliers[item.type];
    return formatFloat(item.baseValue * commodityMultiplier * getMonopolyMultiplier(item.id, player));
}