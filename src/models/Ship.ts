import Upgrades from "./Upgrades"
import Cargo from "./Cargo"
import type { GameState } from "../types/GameState"
import { isNumber, printInformation, timeoutInSeconds } from "../utils/TextUtils"
import { constructReadline } from "../utils/ReadlineUtils"
import type { Interface } from "readline/promises"
import type Player from "./Player"

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
    addCrew(crewToHire: number, player: Player): CrewOutcome
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

    public addCrew(crewToHire: number, player: Player): CrewOutcome {
        if (this._crew + crewToHire > this.numberOfBeds) {
            return { kind: 'NotEnoughBeds', beds: this._numberOfBeds, currentCrew: this._crew, attempted: crewToHire }
        }

        const cost = crewToHire * 200;
        if (cost > player.balance) {
            return { kind: 'NotEnoughMoney', cost, balance: player.balance }
        }

        this._crew += crewToHire;
        return { kind: "Success", cost, crew: crewToHire}
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

export async function hireCrew(player: Player, rl?: Interface): Promise<GameState> {
    if (!rl) {
        rl = constructReadline();
    }

    const crewToHirePlayerResponse = await rl.question("Enter the number of crew you'd like to hire: ");

    let outcome: CrewOutcome;
    if (!isNumber(crewToHirePlayerResponse)) {
        rl.write(message({ kind: 'NotANumber', input: crewToHirePlayerResponse }));
        return hireCrew(player, rl);
    }

    const crewToHire = parseInt(crewToHirePlayerResponse);

    if (crewToHire < 0) {
        rl.write(message({ kind: 'NegativeValue' }))
        return hireCrew(player, rl);
    }

    outcome = player.ship.addCrew(crewToHire, player);
    
    rl.write(message(outcome));
    if (outcome.kind !== 'Success') {
        return hireCrew(player, rl);
    }

    player.removeFunds(outcome.cost);

    rl.close();
    return 'At Island';
}

type CrewOutcome = 
 | { kind: 'Success'; cost: number; crew: number }
 | { kind: 'NotEnoughBeds'; beds: number; attempted: number; currentCrew: number }
 | { kind: 'NotEnoughMoney'; cost: number; balance: number }
 | { kind: 'NotANumber'; input: string }
 | { kind: 'NegativeValue'; }

 function message(outcome: CrewOutcome) {
    switch (outcome.kind) {
        case 'Success': return `Ye hired ${outcome.crew} crewmate fer ${outcome.cost} Doubloons!\n`
        case 'NotEnoughBeds': return `Thar be nah enough cots on yer ship. Ye only 'ave ${outcome.beds} cots 'n ${outcome.currentCrew} crew but be wantin' t' add ${outcome.attempted} more.\n`
        case 'NotEnoughMoney': return `Ye be tryin' t' spend ${outcome.cost} Doubloons, but ye only 'ave ${outcome.balance}. Ye be broke.\n`
        case 'NotANumber': return `Blast ye! ${outcome.input} ain't a number. Give it another go.\n`
        case 'NegativeValue': return `Ye caught me, I 'ave nah added sellin' yet.\n`
    }
 }