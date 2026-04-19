import Player from "./Player";
import { getIslands, type IslandCommoditiesTable } from "./Island";
import { formatFloat } from "../utils/TextUtils";
import { Vendor } from "./Vendor";

export function updateGlobalItemPrice(itemId: number, player: Player) {
    const islands = getIslands();
    const vendorTotal = islands.reduce((total, island) => {
        const item = island.vendor.inventory.find(x => x.id === itemId);
        return total + (item?.units ?? 0);
    }, 0)

    const playerTotal = player.ship.cargo.inventory.find(x => x.id === itemId)?.units ?? 0;

    const worldTotal = vendorTotal + playerTotal;

    const playerOwnPercentage = formatFloat(playerTotal / worldTotal, 6);
    const monopolyMultiplier = itemMonopolyMultiplier(playerOwnPercentage);
    
    return monopolyMultiplier;
}

function itemMonopolyMultiplier(marketShare: number) {
    console.log(`Share: ${marketShare}, calc: ${(1 + 2*marketShare)**1.5}`);
    return (1 + 2*marketShare) ** 1.5;
}

export function recomputePrices(vendor: Vendor, multipliers: IslandCommoditiesTable, player: Player) {
    return 
}