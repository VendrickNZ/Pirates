import Upgrades from "./Upgrades"
import Cargo from "./Cargo"

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
}

export class BaseShip implements Ship {
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
}