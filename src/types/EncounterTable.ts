import type { ShipStats } from "../models/Ship"
import { getRandomFloat, getRandomInt } from "../utils/NumberUtils"
import { formatFloat } from "../utils/TextUtils";

export const MAX_ENCOUNTER_TABLE_PERCENTAGE = 100;

/** List of Events */
export type EncounterTable = Event[];

export type Event = Readonly<DiseaseEvent> | Readonly<WeatherEvent> | Readonly<RescueEvent> | Readonly<PirateEvent>
export type DiseaseEvent = {
    type: 'Disease',
    name: string,
    weight: number,
    severity: number
}

export type WeatherEvent = {
    type: 'Weather',
    name: string,
    weight: number,
    severity: number
}

export type RescueEvent = {
    type: 'Rescue',
    name: string,
    weight: number,
    numberOfSailors: number
}

export type PirateEvent = {
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
        "name": "RMS Titanic",
        "weight": 2,
        "numberOfSailors": 5
    },
    {
        "type": "Rescue",
        "name": "USS Arizona",
        "weight": 1,
        "numberOfSailors": 3
    },
    {
        "type": "Rescue",
        "name": "RMS Lusitania",
        "weight": 3,
        "numberOfSailors": 6
    },
    {
        "type": "Rescue",
        "name": "USS Boaty McBoatface",
        "weight": 2,
        "numberOfSailors": 2
    },
    {
        "type": "Rescue",
        "name": "USS Maine",
        "weight": 1,
        "numberOfSailors": 5
    }
]

const PirateEvents: PirateEvent[] = [
    {
        type: "Pirate",
        name: "Black Beard Pirates",
        weight: 1,
        ship: {
            name: "Queen Anne's Revenge",
            currentHealth: 330,
            maxHealth: 330,
            crew: 80,
            numberOfBeds: 100,
            minimumCrewToSail: 20,
            wagesPerDay: 3,
            speed: 5,
            armour: 38,
            damage: 30,
            currentWeight: 0,
            maxWeight: 500,
            currentUpgradeSlots: 0,
            maxUpgradeSlots: 6
        }
    },
    {
        type: "Pirate",
        name: "Red Beard Pirates",
        weight: 2,
        ship: {
            name: "Queen Boudicca's Revenge",
            currentHealth: 180,
            maxHealth: 180,
            crew: 70,
            numberOfBeds: 100,
            minimumCrewToSail: 18,
            wagesPerDay: 3,
            speed: 4,
            armour: 22,
            damage: 22,
            currentWeight: 0,
            maxWeight: 400,
            currentUpgradeSlots: 0,
            maxUpgradeSlots: 5
        }
    },
    {
        type: "Pirate",
        name: "Pirates of Edward Kenway",
        weight: 4,
        ship: {
            name: "Jackdaw",
            currentHealth: 155,
            maxHealth: 155,
            crew: 65,
            numberOfBeds: 100,
            minimumCrewToSail: 16,
            wagesPerDay: 2,
            speed: 4,
            armour: 18,
            damage: 18,
            currentWeight: 0,
            maxWeight: 300,
            currentUpgradeSlots: 0,
            maxUpgradeSlots: 4
        }
    },
    {
        type: "Pirate",
        name: "Jack Sparrow",
        weight: 6,
        ship: {
            name: "Black Pearl",
            currentHealth: 100,
            maxHealth: 100,
            crew: 60,
            numberOfBeds: 100,
            minimumCrewToSail: 15,
            wagesPerDay: 2,
            speed: 3,
            armour: 5,
            damage: 40,
            currentWeight: 0,
            maxWeight: 250,
            currentUpgradeSlots: 0,
            maxUpgradeSlots: 3
        }
    }
]

export const allEvents = [...DiseaseEvents, ...WeatherEvents, ...RescueEvents, ...PirateEvents]

/** Get min-max random events, defaults to 3-7, no duplicates */
export function getRandomEvents(min = 3, max = 7): EncounterTable {
    const eventsToChooseFrom = allEvents.slice();
    const numberOfEventsToGet = getRandomInt(min, max);

    const eventsChosen = [];
    for (let i = 0; i < numberOfEventsToGet; i++) {
        const totalNumberOfEvents = eventsToChooseFrom.length - 1;
        const randomIndex = getRandomInt(0, totalNumberOfEvents);
        eventsChosen.push(eventsToChooseFrom[randomIndex]);
        eventsToChooseFrom.splice(randomIndex, 1);
    }

    return normalizeEncounterTable(eventsChosen);
}

export function normalizeEncounterTable(events: EncounterTable) {
    const normalizedTable: EncounterTable = events.map(
        x => ({
            ...x,
            weight: formatFloat(x.weight * getRandomFloat(0.5, 3))
        })
    )

    const totalWeight = normalizedTable.reduce((acc, currEvent) => acc + currEvent.weight, 0);
    if (totalWeight > MAX_ENCOUNTER_TABLE_PERCENTAGE) {
        pruneEncounterTable(normalizedTable);
    }

    return normalizedTable;
}

function pruneEncounterTable(events: EncounterTable) {
    while (events.reduce((acc, currEvent) => acc + currEvent.weight, 0) > MAX_ENCOUNTER_TABLE_PERCENTAGE) {
        events.pop();
    }
}
