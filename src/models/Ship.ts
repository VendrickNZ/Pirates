import type { Interface } from "readline/promises"
import type { GameState } from "../types/GameState"
import { printInformation, prompt, isNumber } from "../utils/TextUtils"
import Cargo from "./Cargo"
import type Player from "./Player"
import { ItemLookup, type ItemReference, type Item, type Inventory } from "../types/Item"

export const COST_TO_HIRE_CREW = 50;
export const CALCULATE_COST_TO_HIRE_CREW = (numberOfCrew: number) => (numberOfCrew * COST_TO_HIRE_CREW);
export interface ShipStats {
    name: string
    currentHealth: number
    maxHealth: number
    crew: number
    numberOfBeds: number
    minimumCrewToSail: number
    wagesPerDay: number
    speed: number
    armour: number
    damage: number
    currentWeight: number
    maxWeight: number
    currentUpgradeSlots: number
    maxUpgradeSlots: number
}

type NumericShipStats = Omit<ShipStats, 'name'>

export class Ship {
    private _stats: ShipStats;
    private _cargo: Cargo;
    private _speedPenaltyStack: number[] = [];

    constructor(stats: ShipStats, startingCargo?: Inventory) {
        this._stats = stats;
        this._cargo = new Cargo(startingCargo);

        if (startingCargo) this.updateWeightForStartingCargo(startingCargo);
    }

    get name(): string { return this._stats.name; }
    get currentHealth(): number { return this._stats.currentHealth; }
    get maxHealth(): number { return this._stats.maxHealth; }
    get crew(): number { return this._stats.crew; }
    get numberOfBeds(): number { return this._stats.numberOfBeds; }
    get minimumCrewToSail(): number { return this._stats.minimumCrewToSail; }
    get wagesPerDay(): number { return this._stats.wagesPerDay; }
    /** In knots */
    get speed(): number { return this._stats.speed; }
    get armour(): number { return this._stats.armour; }
    get damage(): number { return this._stats.damage; }
    get currentWeight(): number { return this._stats.currentWeight; }
    get maxWeight(): number { return this._stats.maxWeight; }
    get cargo(): Cargo { return this._cargo; }
    get upgradeCount(): number { return this._stats.currentUpgradeSlots; }
    get upgradeMax(): number { return this._stats.maxUpgradeSlots; }
    get stats(): ShipStats { return this._stats; }


    set upgradeCount(count: number) {
        this.stats.currentUpgradeSlots = count;
    }

    set currentHealth(health: number) {
        this.stats.currentHealth = Math.min(health, this.stats.maxHealth);
    }

    addCargo(itemRef: ItemReference) {
        const existingItem = this._cargo.inventory.find(x => x.id === itemRef.id);
        if (existingItem) {
            existingItem.units++;
        } else {
            const newItem: ItemReference = { id: itemRef.id, units: 1, currentValue: itemRef.currentValue };
            this._cargo.inventory.push(newItem);
        }

        const item = ItemLookup.get(itemRef.id)!;

        this._stats.currentWeight += item.weight;
        this._cargo.update();
    }

    removeCargo(itemRef: ItemReference) {
        const item = ItemLookup.get(itemRef.id);
        if (!item) return;

        if (itemRef.units > 1) {
            itemRef.units--;
        } else {
            const index = this.cargo.inventory.indexOf(itemRef);
            this.cargo.inventory.splice(index, 1);
        }

        this._stats.currentWeight -= item.weight;
        this._cargo.update();
    }

    haveEnoughSpaceForCrew(crewToHire: number): CrewOutcome {
        if (this.stats.crew + crewToHire > this.numberOfBeds) {
            return { kind: 'NotEnoughBeds', beds: this.stats.numberOfBeds, currentCrew: this.stats.crew, attempted: crewToHire }
        }

        return { kind: 'Success' }
    }

    haveEnoughCapacityForCargo(cargoToAdd: ItemReference) {
        const cargoItem = ItemLookup.get(cargoToAdd.id);
        const newWeight = this._stats.currentWeight + (cargoItem?.weight || 0);
        return this._stats.maxWeight >= newWeight;
    }

    addCrew(crewToHire: number): CrewOutcome {
        this.stats.crew += crewToHire;
        return { kind: "Success" }
    }

    removeCrew(crewToRemove: number) {
        this.stats.crew -= crewToRemove;
        if (this.stats.crew < 0) {
            this.stats.crew = 0;
        }
    }

    takeDamage(damageToTake: number) {
        this.currentHealth -= damageToTake;
    }

    async viewCargo(rl: Interface) {
        await this.cargo.playerCommand(rl);
    }

    hasEnoughCrewForSailing() {
        return this.crew >= this.minimumCrewToSail;
    }

    hasEnoughUpgradeSlots() {
        return this.upgradeCount < this.upgradeMax;
    }

    upgradeWouldStallShip(item: Item): boolean {
        if (item.type !== 'Upgrade') return false;
        const { speedPenaltyFactor, speed } = item.effect;
        if (speedPenaltyFactor !== undefined) {
            return (this._stats.speed - Math.floor(this._stats.speed * speedPenaltyFactor)) < 1;
        }
        if (speed !== undefined) {
            return (this._stats.speed + speed) < 1;
        }
        return false;
    }

    applyItemEffectIfApplicable(item: Item) {
        if (item.type !== 'Upgrade') return;
        this.upgradeCount += 1;

        const { speedPenaltyFactor, ...flatEffects } = item.effect;

        if (speedPenaltyFactor !== undefined) {
            const penalty = Math.floor(this._stats.speed * speedPenaltyFactor);
            this._speedPenaltyStack.push(penalty);
            this._stats.speed = Math.max(1, this._stats.speed - penalty);
        }

        for (const [key, value] of Object.entries(flatEffects) as [keyof NumericShipStats, number][]) {
            this._stats[key] = (this._stats[key] as number) + value;
        }
    }

    removeItemEffectIfApplicable(item: Item) {
        if (item.type !== 'Upgrade') return;
        this.upgradeCount -= 1;

        const { speedPenaltyFactor, ...flatEffects } = item.effect;

        if (speedPenaltyFactor !== undefined) {
            const penalty = this._speedPenaltyStack.pop() ?? 0;
            this._stats.speed += penalty;
        }

        for (const [key, value] of Object.entries(flatEffects) as [keyof NumericShipStats, number][]) {
            this._stats[key] = (this._stats[key] as number) - value;
        }
    }
   
    updateWeightForStartingCargo(startingCargo: Inventory) {
        for (const itemRef of startingCargo) {
            const item = ItemLookup.get(itemRef.id);
            this._stats.currentWeight += (item?.weight ?? 0) * itemRef.units;
        }
    }
}

export type CrewOutcome =
    | { kind: 'Success' }
    | { kind: 'NotEnoughBeds'; beds: number; attempted: number; currentCrew: number }
    | { kind: 'NotEnoughMoney'; cost: number; balance: number }
    | { kind: 'NotANumber'; input: string }

function message(outcome: CrewOutcome) {
    switch (outcome.kind) {
        case 'NotEnoughBeds': return `Thar be nah enough cots on yer ship. Ye only 'ave ${outcome.beds} cots 'n ${outcome.currentCrew} crew but be wantin' t' add ${outcome.attempted} more.\n`
        case 'NotEnoughMoney': return `Ye be tryin' t' spend ${outcome.cost} Doubloons, but ye only 'ave ${outcome.balance}. Ye be broke.\n`
        case 'NotANumber': return `Blast ye! ${outcome.input} ain't a number. Give it another go.\n`
    }
}

export async function viewShip(ship: Ship): Promise<GameState> {
    printInformation(printShipStatistics(ship))
    return 'At Island'
}

function printShipStatistics(ship: Ship): string {
    return [
        `Name: ${ship.name}`,
        `Current health: ${ship.currentHealth}`,
        `Crew: ${ship.crew}`,
        `Number of beds: ${ship.numberOfBeds}`,
        `Minimum crew to sail: ${ship.minimumCrewToSail}`,
        `Wages per day: ${ship.wagesPerDay} Doubloons`,
        `Speed: ${ship.speed} km / day`,
        `Armor: ${ship.armour}, Damage: ${ship.damage}`,
        `Cargo weight: ${ship.currentWeight} / ${ship.maxWeight}`,
        `Upgrades: ${ship.upgradeCount} / ${ship.upgradeMax} slots filled`,
    ].join('\n');
}

export async function hireCrew(player: Player, rl: Interface): Promise<GameState> {
    const crewToHirePlayerResponse = await prompt(rl, "Enter the number of crew to hire (negative to dismiss):");

    if (!isNumber(crewToHirePlayerResponse)) {
        console.log(message({ kind: 'NotANumber', input: crewToHirePlayerResponse }));
        return hireCrew(player, rl);
    }

    const crewToChange = parseInt(crewToHirePlayerResponse);

    if (crewToChange < 0) {
        const crewToDismiss = Math.min(Math.abs(crewToChange), player.ship.crew);
        player.ship.removeCrew(crewToDismiss);
        console.log(`Ye dismissed ${crewToDismiss} crewmates. They wandered off into the port.\n`);
        return 'At Island';
    }

    if (crewToChange === 0) {
        return 'At Island';
    }

    const cost = CALCULATE_COST_TO_HIRE_CREW(crewToChange);

    const spaceOutcome = player.ship.haveEnoughSpaceForCrew(crewToChange);
    if (spaceOutcome.kind !== 'Success') {
        console.log(message(spaceOutcome));
        return hireCrew(player, rl);
    }

    if (player.balance < cost) {
        console.log(message({ kind: 'NotEnoughMoney', cost, balance: player.balance }));
        return hireCrew(player, rl);
    }

    player.ship.addCrew(crewToChange);
    player.removeFunds(cost);
    console.log(`Ye hired ${crewToChange} crewmates fer ${cost} Doubloons!\n`);

    return 'At Island';
}

export function createShip(kind: keyof typeof ShipPresets) {
    return new Ship(ShipPresets[kind]);
}


type ShipsThatExist = 'StartingShip'

/**
 * When it comes to speed I'm going for generally:
 * Slow: 4-6 knots
 * Medium 8-10 knots
 * Fast 12-14 knots
 */
export const ShipPresets: Record<ShipsThatExist, ShipStats> = {
    'StartingShip': {
        name: 'Victoria',
        currentHealth: 100,
        maxHealth: 100,
        crew: 0,
        numberOfBeds: 10,
        minimumCrewToSail: 3,
        wagesPerDay: 1,
        speed: 5,
        armour: 10,
        damage: 12,
        currentWeight: 0,
        maxWeight: 150,
        currentUpgradeSlots: 0,
        maxUpgradeSlots: 2
    }
}