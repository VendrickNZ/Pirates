import type { Interface } from "readline/promises"
import type { GameState } from "../types/GameState"
import { printInformation, timeoutInSeconds, isNumber } from "../utils/TextUtils"
import Cargo from "./Cargo"
import type Player from "./Player"
import Upgrades from "./Upgrades"
import { GameItems, type ItemReference } from "../types/Item"

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
}


export class Ship {
    private _stats: ShipStats;
    private _cargo: Cargo;
    private _upgrades: Upgrades;

    constructor(stats: ShipStats) {
        this._stats = stats;
        this._cargo = new Cargo(this.maxWeight);
        this._upgrades = new Upgrades();
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
    get upgrades(): Upgrades { return this._upgrades; }
    get cargoMax(): number { return this.cargo.maxCapacity; }
    get upgradeCount(): number { return this.upgrades.currentNumber; }
    get upgradeMax(): number { return this.upgrades.maxNumber; }
    get stats(): ShipStats { return this._stats; }

    set currentWeight(weight: number) {
        this._stats.currentWeight = weight;
    }

    addCargo(itemRef: ItemReference) {
        const existingItem = this._cargo.inventory.find(x => x.id === itemRef.id);
        if (existingItem) {
            existingItem.units++;
        } else {
            const newItem: ItemReference = { id: itemRef.id, units: 1, currentValue: itemRef.currentValue };
            this._cargo.inventory.push(newItem);
        }

        const item = GameItems.find(x => x.id == itemRef.id)!;

        this.cargo.currentCapacity += item.weight;
        this._cargo.update();
    }

    removeCargo(itemRef: ItemReference) {
        const index = this.cargo.inventory.indexOf(itemRef);
        this.cargo.inventory.splice(index, 1);

        const item = GameItems.find(x => x.id === itemRef.id);
        if (!item) return;

        this.cargo.currentCapacity -= item.weight;
        this._cargo.update();
    }

    haveEnoughSpaceForCrew(crewToHire: number): CrewOutcome {
        if (this.stats.crew + crewToHire > this.numberOfBeds) {
            return { kind: 'NotEnoughBeds', beds: this.stats.numberOfBeds, currentCrew: this.stats.crew, attempted: crewToHire }
        }

        return { kind: 'Success' }
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

    async viewCargo(rl: Interface) {
        await this.cargo.playerCommand(rl);
    }
}

export type CrewOutcome =
    | { kind: 'Success' }
    | { kind: 'NotEnoughBeds'; beds: number; attempted: number; currentCrew: number }
    | { kind: 'NotEnoughMoney'; cost: number; balance: number }
    | { kind: 'NotANumber'; input: string }
    | { kind: 'NegativeValue'; }

function message(outcome: CrewOutcome) {
    switch (outcome.kind) {
        case 'NotEnoughBeds': return `Thar be nah enough cots on yer ship. Ye only 'ave ${outcome.beds} cots 'n ${outcome.currentCrew} crew but be wantin' t' add ${outcome.attempted} more.\n`
        case 'NotEnoughMoney': return `Ye be tryin' t' spend ${outcome.cost} Doubloons, but ye only 'ave ${outcome.balance}. Ye be broke.\n`
        case 'NotANumber': return `Blast ye! ${outcome.input} ain't a number. Give it another go.\n`
        case 'NegativeValue': return `Ye caught me, I 'ave nah added sellin' yet.\n`
    }
}

export async function viewShip(ship: Ship): Promise<GameState> {
    printInformation(printShipStatistics(ship))
    await timeoutInSeconds(3);
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
        `Current weight: ${ship.currentWeight}`,
        `Max weight: ${ship.maxWeight}`,
        `Cargo: ${ship.cargo.currentCapacity} / ${ship.cargo.maxCapacity} slots filled`,
        `Upgrades: ${ship.upgrades.currentNumber} / ${ship.upgrades.maxNumber} slots filled`,
    ].join('\n');
}

export async function hireCrew(player: Player, rl: Interface): Promise<GameState> {
    const crewToHirePlayerResponse = await rl.question("Enter the number of crew you'd like to hire: ");

    if (!isNumber(crewToHirePlayerResponse)) {
        console.log(message({ kind: 'NotANumber', input: crewToHirePlayerResponse }));
        return hireCrew(player, rl);
    }

    const crewToHire = parseInt(crewToHirePlayerResponse);
    if (crewToHire < 0) {
        console.log(message({ kind: 'NegativeValue' }));
        return hireCrew(player, rl);
    }

    const cost = CALCULATE_COST_TO_HIRE_CREW(crewToHire);

    const spaceOutcome = player.ship.haveEnoughSpaceForCrew(crewToHire);
    if (spaceOutcome.kind !== 'Success') {
        console.log(message(spaceOutcome));
        return hireCrew(player, rl);
    }

    if (player.balance < cost) {
        console.log(message({ kind: 'NotEnoughMoney', cost, balance: player.balance }));
        return hireCrew(player, rl);
    }

    player.ship.addCrew(crewToHire);
    player.removeFunds(cost);
    console.log(`Ye hired ${crewToHire} crewmates fer ${cost} Doubloons!\n`);

    return 'At Island';
}

export function createShip(kind: keyof typeof ShipPresets) {
    return new Ship(ShipPresets[kind]);
}


type ShipsThatExist = 'StartingShip' | 'AnotherShip'


/**
 * When it comes to speed I'm going for generally:
 * Slow: 4-6 knots
 * Medium 8-10 knots
 * Fast 12-14 knots
 */
export const ShipPresets: Record<ShipsThatExist, ShipStats> = {
    'StartingShip': {
        name: 'The Black Pearl',
        currentHealth: 100,
        maxHealth: 100,
        crew: 0,
        numberOfBeds: 10,
        minimumCrewToSail: 3,
        wagesPerDay: 10,
        speed: 4,
        armour: 10,
        damage: 3,
        currentWeight: 0,
        maxWeight: 150
    },
    'AnotherShip': {
        name: 'Stormbreaker',
        currentHealth: 120,
        maxHealth: 120,
        crew: 0,
        numberOfBeds: 14,
        minimumCrewToSail: 4,
        wagesPerDay: 12,
        speed: 6,
        armour: 12,
        damage: 3,
        currentWeight: 0,
        maxWeight: 155
    }
}