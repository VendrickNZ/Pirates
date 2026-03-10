import type { Ship, ShipStats } from "../models/Ship"

type DiseaseEvent = {
    name: string,
    weight: number,
    severity: number
}

type WeatherEvent = {
    name: string,
    weight: number,
    severity: number
}

type RescueEvent = {
    shipName: string,
    weight: number,
    numberOfSailors: number
}

type PirateEvent = {
    name: string,
    weight: number,
    ship: ShipStats
}

export const DiseaseEvents: DiseaseEvent[] = [
    {
        "name": "Coronavirus",
        "weight": 2,
        "severity": 0.3
    },
    {
        "name": "Scurvy",
        "weight": 5,
        "severity": 0.1
    },
    {
        "name": "Smallpox",
        "weight": 3,
        "severity": 0.25
    },
    {
        "name": "Cholera",
        "weight": 2,
        "severity": 0.45
    },
    {
        "name": "Black Death",
        "weight": 1,
        "severity": 0.75
    },
    {
        "name": "Influenza",
        "weight": 4,
        "severity": 0.16
    }
]

export const WeatherEvents: WeatherEvent[] = [
    {
        "name": "Small Hurricane",
        "weight": 3,
        "severity": 0.5
    },
    {
        "name": "Moderate Hurricane",
        "weight": 2,
        "severity": 0.75
    },
    {
        "name": "Severe Hurricane",
        "weight": 1,
        "severity": 1.0
    },
    {
        "name": "Water Spout",
        "weight": 3,
        "severity": 0.4
    },
    {
        "name": "Severe Water Spout",
        "weight": 1,
        "severity": 0.67
    },
    {
        "name": "Thunder Storm",
        "weight": 6,
        "severity": 0.2
    },
    {
        "name": "Severe Thunder Storm",
        "weight": 4,
        "severity": 0.4
    },
    {
        "name": "Lightning Strike",
        "weight": 4,
        "severity": 0.1
    },
    {
        "name": "Tsunami",
        "weight": 1,
        "severity": 0.5
    },
    {
        "name": "Tea Tsunami",
        "weight": 1,
        "severity": 0.2
    }
]

export const RescueEvents: RescueEvent[] = [
    {
        "shipName": "RMS Titanic",
        "weight": 2,
        "numberOfSailors": 5
    }, 
    {
        "shipName": "USS Arizona",
        "weight": 1,
        "numberOfSailors": 3
    },
    {
        "shipName": "RMS Lusitania",
        "weight": 3,
        "numberOfSailors": 6
    },
    {
        "shipName": "USS Boaty McBoatface",
        "weight": 2,
        "numberOfSailors": 2
    },
    {
        "shipName": "USS Maine",
        "weight": 1,
        "numberOfSailors": 5
    }
]

export const PirateEvents: PirateEvent[] = [
    {
        name: "Black Beard Pirates",
        weight: 4,
        ship: {
            name: "Queen Anne's Revenge",
            currentHealth: 350,
            maxHealth: 350,
            crew: 80,
            numberOfBeds: 100,
            minimumCrewToSail: 20,
            wagesPerDay: 40,
            speed: 1,
            armour: 40,
            damage: 25,
            currentWeight: 1,
            maxWeight: 500
        }
    },
    {
        name: "Red Beard Pirates",
        weight: 6,
        ship: {
            name: "Queen Boudicca's Revenge",
            currentHealth: 175,
            maxHealth: 175,
            crew: 70,
            numberOfBeds: 100,
            minimumCrewToSail: 18,
            wagesPerDay: 35,
            speed: 1,
            armour: 30,
            damage: 30,
            currentWeight: 1,
            maxWeight: 500
        }
    },
    {
        name: "Jack Sparrow",
        weight: 3,
        ship: {
            name: "Black Pearl",
            currentHealth: 150,
            maxHealth: 150,
            crew: 60,
            numberOfBeds: 100,
            minimumCrewToSail: 15,
            wagesPerDay: 30,
            speed: 1,
            armour: 5,
            damage: 50,
            currentWeight: 1,
            maxWeight: 500
        }
    },
    {
        name: "Pirates of Edward Kenway",
        weight: 1,
        ship: {
            name: "Jackdaw",
            currentHealth: 165,
            maxHealth: 165,
            crew: 65,
            numberOfBeds: 100,
            minimumCrewToSail: 16,
            wagesPerDay: 32,
            speed: 1,
            armour: 30,
            damage: 30,
            currentWeight: 1,
            maxWeight: 500
        }
    }
]