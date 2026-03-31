import type { ShipStats } from "../models/Ship"
import { getRandomFloat, getRandomInt } from "../utils/NumberUtils"


export type Encounters = Record<number, Event>

type Event = DiseaseEvent | WeatherEvent | RescueEvent | PirateEvent
type DiseaseEvent = {
    type: 'Disease',
    name: string,
    weight: number,
    severity: number
}

type WeatherEvent = {
    type: 'Weather',
    name: string,
    weight: number,
    severity: number
}

type RescueEvent = {
    type: 'Rescue',
    shipName: string,
    weight: number,
    numberOfSailors: number
}

type PirateEvent = {
    type: 'Pirate',
    name: string,
    weight: number,
    ship: ShipStats
}

const DiseaseEvents: DiseaseEvent[] = [
    {
        "type": "Disease",
        "name": "Coronavirus",
        "weight": 2,
        "severity": 0.3
    },
    {
        "type": "Disease",
        "name": "Scurvy",
        "weight": 5,
        "severity": 0.1
    },
    {
        "type": "Disease",
        "name": "Smallpox",
        "weight": 3,
        "severity": 0.25
    },
    {
        "type": "Disease",
        "name": "Cholera",
        "weight": 2,
        "severity": 0.45
    },
    {
        "type": "Disease",
        "name": "Black Death",
        "weight": 1,
        "severity": 0.75
    },
    {
        "type": "Disease",
        "name": "Influenza",
        "weight": 4,
        "severity": 0.16
    }
]

const WeatherEvents: WeatherEvent[] = [
    {
        "type": "Weather",
        "name": "Small Hurricane",
        "weight": 3,
        "severity": 0.5
    },
    {
        "type": "Weather",
        "name": "Moderate Hurricane",
        "weight": 2,
        "severity": 0.75
    },
    {
        "type": "Weather",
        "name": "Severe Hurricane",
        "weight": 1,
        "severity": 1.0
    },
    {
        "type": "Weather",
        "name": "Water Spout",
        "weight": 3,
        "severity": 0.4
    },
    {
        "type": "Weather",
        "name": "Severe Water Spout",
        "weight": 1,
        "severity": 0.67
    },
    {
        "type": "Weather",
        "name": "Thunder Storm",
        "weight": 6,
        "severity": 0.2
    },
    {
        "type": "Weather",
        "name": "Severe Thunder Storm",
        "weight": 4,
        "severity": 0.4
    },
    {
        "type": "Weather",
        "name": "Lightning Strike",
        "weight": 4,
        "severity": 0.1
    },
    {
        "type": "Weather",
        "name": "Tsunami",
        "weight": 1,
        "severity": 0.5
    },
    {
        "type": "Weather",
        "name": "Tea Tsunami",
        "weight": 1,
        "severity": 0.2
    }
]

const RescueEvents: RescueEvent[] = [
    {
        "type": "Rescue",
        "shipName": "RMS Titanic",
        "weight": 2,
        "numberOfSailors": 5
    },
    {
        "type": "Rescue",
        "shipName": "USS Arizona",
        "weight": 1,
        "numberOfSailors": 3
    },
    {
        "type": "Rescue",
        "shipName": "RMS Lusitania",
        "weight": 3,
        "numberOfSailors": 6
    },
    {
        "type": "Rescue",
        "shipName": "USS Boaty McBoatface",
        "weight": 2,
        "numberOfSailors": 2
    },
    {
        "type": "Rescue",
        "shipName": "USS Maine",
        "weight": 1,
        "numberOfSailors": 5
    }
]

const PirateEvents: PirateEvent[] = [
    {
        type: "Pirate",
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
        type: "Pirate",
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
        type: "Pirate",
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
        type: "Pirate",
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

export const allEvents = [...DiseaseEvents, ...WeatherEvents, ...RescueEvents, ...PirateEvents]

/** Get min-max random events, defaults to 3-7 */
export function getRandomEvents(min = 3, max = 7): Event[] {
    const numberOfEventsToGet = getRandomInt(min, max);
    const totalNumberOfEvents = allEvents.length - 1;

    const eventsChosen = [];
    for (let i = 0; i <= numberOfEventsToGet; i++) {
        const randomIndex = getRandomInt(0, totalNumberOfEvents);
        eventsChosen.push(allEvents[randomIndex]);
    }

    console.log(numberOfEventsToGet);
    return eventsChosen;
}

/** current issue is that i need to ensure that the total < 100, i need to do some extra logic/computation */
export function normalizeEncounterTable(events: Event[]) {
    const multiplier = getRandomFloat(0.5, 3);
    for (const event of events) {
        event.weight *= multiplier
        event.weight = parseFloat(event.weight.toFixed(1));
    }
}