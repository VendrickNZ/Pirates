import Upgrades from "./Upgrades"
import Cargo from "./Cargo"
import type { GameState } from "../types/GameState"
import { isNumber, printInformation, timeoutInSeconds } from "../utils/TextUtils"
import { constructReadline } from "../utils/ReadlineUtils"
import type { Interface } from "readline/promises"

export interface Ship {
    name: string
    currentHealth: number
    maxHealth: number
    crew: number
    numberOfBeds: number
    minimumCrewToSail: number
    wagesPerDay: number
    speed: number
    armor: number
    damage: number
    currentWeight: number
    maxWeight: number
    cargo: Cargo
    upgrades: Upgrades
    addCrew(crewToHire: number): string
    viewCargo(): string
}

export class StartingShip implements Ship {
    private _name: string
    private _currentHealth: number
    private _maxHealth: number
    private _crew: number
    private _numberOfBeds: number
    private _minimumCrewToSail: number
    private _wagesPerDay: number
    private _speed: number
    private _armor: number
    private _damage: number
    private _currentWeight: number
    private _maxWeight: number
    private _cargo: Cargo
    private _upgrades: Upgrades

    constructor() {
        this._name = "The Black Pearl"
        this._currentHealth = 100
        this._maxHealth = 100
        this._crew = 0
        this._numberOfBeds = 10
        this._minimumCrewToSail = 3
        this._wagesPerDay = 10
        this._speed = 5
        this._armor = 10
        this._damage = 3
        this._currentWeight = 0
        this._maxWeight = 150
        this._cargo = new Cargo()
        this._upgrades = new Upgrades()
    }

    public get name(): string {
        return this._name
    }

    public get currentHealth(): number {
        return this._currentHealth
    }

    public get maxHealth(): number {
        return this._maxHealth
    }

    public get crew(): number {
        return this._crew
    }

    public get numberOfBeds(): number {
        return this._numberOfBeds
    }

    public get minimumCrewToSail(): number {
        return this._minimumCrewToSail
    }

    public get wagesPerDay(): number {
        return this._wagesPerDay
    }

    public get speed(): number {
        return this._speed
    }

    public get armor(): number {
        return this._armor
    }

    public get damage(): number {
        return this._damage
    }

    public get currentWeight(): number {
        return this._currentWeight
    }

    public get maxWeight(): number {
        return this._maxWeight
    }

    public get cargo(): Cargo {
        return this._cargo
    }

    public get upgrades(): Upgrades {
        return this._upgrades
    }

    public get cargoCount(): number {
        return this.cargo.count;
    }

    public get cargoMax(): number {
        return this.cargo.maxCapacity;
    }

    public get upgradeCount(): number {
        return this.upgrades.currentNumber;
    }

    public get upgradeMax(): number {
        return this.upgrades.maxNumber;
    }

    public addCrew(crewToHire: number): string {
        if (this._crew + crewToHire > this.numberOfBeds) {
            return 'There arrrr not enough beds for all of ye cabin crew. Try again. '; // can make functions for these, return string not boolean
        }
        this._crew += crewToHire;
        return `You hired ${crewToHire} for n Doubloons!`;
    }

    public viewCargo(): string {
        return this.cargo.printCargoStatistics();
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
        `Armor: ${ship.armor}, Damage: ${ship.damage}`,
        `Current weight: ${ship.currentWeight}`,
        `Max weight: ${ship.maxWeight}`,
        `Cargo: ${ship.cargo.count} / ${ship.cargo.maxCapacity} slots filled`,
        `Upgrades: ${ship.upgrades.currentNumber} / ${ship.upgrades.maxNumber} slots filled`,
    ].join('\n');
}

export async function hireCrew(ship: Ship, rl?: Interface): Promise<GameState> {
    if (!rl) {
        rl = constructReadline();
    }

    const crewToHire = await rl.question("Enter the number of crew you'd like to hire: ");

    if (!isNumber(crewToHire)) {
        rl.write(`${crewToHire} is not a number, please try again. \n`)
        return hireCrew(ship, rl);
    }

    if (!ship.addCrew(parseInt(crewToHire))) {
        return hireCrew(ship, rl);
    }

    rl.close();
    return 'At Island';
}