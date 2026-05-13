import type { Interface } from "readline/promises";
import type { GameState } from "../types/GameState";
import { GameOverError } from "./GameOver";
import { expandAlias, formatCommand, formatFloat, isNumber, narrate, printHeader, prompt, resetCompletions, setCompletions, sleepInMs, type AliasMap } from "../utils/TextUtils";
import type Player from "./Player";
import { getRandomEvents, PirateEvents, type DiseaseEvent, type EncounterTable, type Event, type PirateEvent, type RescueEvent, type WeatherEvent } from "../types/EncounterTable";
import { getIslands } from "./Island";
import type { IslandId, Island, IslandLocationVector2 } from "./Island";
import { Ship } from "./Ship";
import { getItems, ItemLookup } from "../types/Item";

const HOURS_IN_DAY = 24;

/** 1 knot = 1.852km/h */
const KNOTS_TO_KM_PER_DAY_CONVERSION = (knots: number) => knots * (1.852 * HOURS_IN_DAY);

type Route = {
    destinationIslandId: IslandId,
    distanceKm: number,
    encounterTable: EncounterTable
}
type IslandRoutes = Record<IslandId, Route[]>;

type RouteSelection =
    | { kind: 'selected'; routeIndex: number }
    | { kind: 'back'; }

type ReceivedEvent =
    | { result: true, event: Event }
    | { result: false }

export type DocksResult = { nextState: GameState, daysPassed: number };

export class WorldGraph {
    private _allRoutes: IslandRoutes;

    constructor() {
        this._allRoutes = assignAllRoutes();
    }

    get allRoutes() {
        return this._allRoutes;
    }

    getRoutesFor(islandId: IslandId) {
        return this.allRoutes[islandId];
    }
}

/** heals for 30% */
function healShip(ship: Ship) {
    const amount = formatFloat(ship.maxHealth * 0.3, 0);
    const before = ship.currentHealth;
    ship.currentHealth += amount;
    const actuallyHealed = ship.currentHealth - before;
    if (actuallyHealed > 0) {
        console.log(`Yer crew patched up the ship at the docks (+${actuallyHealed} health, now at ${ship.currentHealth}/${ship.maxHealth}).`);
    }
}

const DOCKS_ALIASES: AliasMap = {
    'R': 'Return',
};

export async function visitDocks(player: Player, rl: Interface, worldGraph: WorldGraph): Promise<DocksResult> {
    setCompletions(['Return']);
    printAvailableRoutes(worldGraph, player);
    const selectedOption = await promptPlayerForRoute(rl);
    resetCompletions();

    if (selectedOption.kind === 'back') {
        return { nextState: 'At Island', daysPassed: 0 };
    }

    healShip(player.ship);
    const daysPassed = await attemptTravelToIsland(selectedOption.routeIndex, player, worldGraph, rl);
    return { nextState: 'At Island', daysPassed };
}

function assignAllRoutes(): IslandRoutes {
    const islands = getIslands();
    const islandRoutes: IslandRoutes = {};
    for (const island of islands) {
        const islandId = island.id;
        islandRoutes[islandId] = assignRoutes(island);
    }

    return islandRoutes;
}

function assignRoutes(islandFrom: Island): Route[] {
    const allOtherIslands = getIslands().filter(i => i.id !== islandFrom.id);

    const islandRoutes: Route[] = [];
    for (const [i, islandTo] of allOtherIslands.entries()) {
        const distance = computeDistanceBetweenIslands(islandFrom.location, islandTo.location);
        islandRoutes[i] = {
            destinationIslandId: islandTo.id,
            distanceKm: distance,
            encounterTable: createEncounterTable()
        };
    }
    return islandRoutes;
}

function computeDistanceBetweenIslands(a: IslandLocationVector2, b: IslandLocationVector2) {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];

    const distance = Math.sqrt(dx**2 + dy**2);
    return parseInt(distance.toFixed(0));
}

function createEncounterTable(): EncounterTable {
    const events = getRandomEvents();
    let encounterTable: EncounterTable = [];
    for (const event of events) {
        encounterTable.push(event);
    }

    return encounterTable;
}

function printAvailableRoutes(graph: WorldGraph, player: Player) {
    printHeader('Available Routes');

    const availableRoutes = graph.getRoutesFor(player.island.id);
    for (const [i, route] of availableRoutes.entries()) {
        const island = getIslands().find(i => i.id === route.destinationIslandId)!;
        console.log('');
        printIslandRouteTitle(i, island.name, route.distanceKm, player.ship);
        printIslandRouteInformation(route.encounterTable, island);
        printIslandRouteItemModifiers(island);
    }
}

function printIslandRouteTitle(index: number, name: string, distance: number, playerShip: Ship) {
    const travelDays = computeTravelDays(distance, playerShip);
    console.log(`[${index+1}] ${name} (${distance} km, ${travelDays} days)`);
}

function printIslandRouteInformation(encounterTable: EncounterTable, island: Island) {
    const totalWeight = encounterTable.reduce((acc, currItem) => acc + currItem.weight, 0);

    console.log(`There is a ${formatFloat(totalWeight, 0)}% chance of encountering one of the following hazards while travelling to ${island.name}:`);

    for (const event of encounterTable) {
        console.log(`\t- ${event.name} (${event.weight}%)`);
    }
}

function printIslandRouteItemModifiers(island: Island) {
    Object.entries(island.commodityMultipliers).forEach(([itemType, value]) => {
        console.log(`${itemType}: ${value}`);
    })
}

function computeTravelDays(distance: number, playerShip: Ship) {
    const shipSpeed = playerShip.speed;
    const distancePerDay = KNOTS_TO_KM_PER_DAY_CONVERSION(shipSpeed);
    return formatFloat(distance / distancePerDay, 0);
}

async function promptPlayerForRoute(rl: Interface): Promise<RouteSelection> {
    const islands = getIslands();
    const numberOfRoutes = islands.length - 1;
    while (true) {
        console.log('');
        console.log(`Select a route (1-${numberOfRoutes}) or type 'return' [R] to go back.`);
        const rawAnswer = await prompt(rl);

        const command = expandAlias(formatCommand(rawAnswer), DOCKS_ALIASES);
        if (command === 'Return') {
            return { kind: 'back' }
        }
        if (isValidRoute(rawAnswer, numberOfRoutes)) {
            return { kind: 'selected', routeIndex: parseInt(rawAnswer) };
        }
    }
}

function isValidRoute(rawAnswer: string, numberOfRoutes: number) {
    if (!isNumber(rawAnswer)) return false;
    const convertedAnswer = parseInt(rawAnswer);
    if (convertedAnswer <= 0 || convertedAnswer > numberOfRoutes) return false;
    return true;
}

async function attemptTravelToIsland(selectedRoute: number, player: Player, worldGraph: WorldGraph, rl: Interface): Promise<number> {
    if (!player.ship.hasEnoughCrewForSailing()) {
        console.log("Yarr! Ye haven't enough crew to set sail. Hire more hands at the docks!");
        return 0;
    }
    const nonPlayerIslands = getIslands().filter(x => x.id !== player.island.id);
    const islandToTravelTo = nonPlayerIslands[selectedRoute - 1];

    const route = worldGraph.getRoutesFor(player.island.id)[selectedRoute - 1];
    let daysPassed = computeTravelDays(route.distanceKm, player.ship);

    if (!player.canAffordToPayWages(daysPassed)) {
        return 0;
    }

    const selectedEvent = selectEvent(route.encounterTable);
    if (selectedEvent.result) {
        const daysAdded = await playEvent(selectedEvent.event, player, rl);
        daysPassed += daysAdded;
    } else {
        await narrate('The seas be calm. A peaceful voyage, with naught but the wind in yer sails.');
    }

    player.island = islandToTravelTo;
    await narrate(`Land ho! Ye dropped anchor at ${islandToTravelTo.name} after ${daysPassed} days at sea.`);
    return daysPassed;
}

function selectEvent(encounterTable: EncounterTable): ReceivedEvent {
    let roll = Math.random() * 100;
    for (const event of encounterTable) {
        roll -= event.weight;
        if (roll < 0) return { result: true, event: event };
    }

    return { result: false }
}

async function playEvent(event: Event, player: Player, rl: Interface): Promise<number> {
    switch (event.type) {
        case 'Disease':
            return await playDiseaseEvent(event, player.ship);
        case 'Weather':
            return await playWeatherEvent(event, player.ship);
        case 'Rescue':
            return playRescueEvent(event, player.ship, rl);
        case 'Pirate':
            return await playPirateEvent(event, player, rl);
        default:
            return 0;
    }
}

async function playDiseaseEvent(event: DiseaseEvent, ship: Ship) {
    const crewToRemove = Math.ceil(ship.crew * event.severity);
    const crewRemoved = Math.min(crewToRemove, ship.crew)
    ship.removeCrew(crewRemoved);

    await narrate(`Disaster! ${event.name} swept through yer ship and ${crewRemoved} crewmates were lost to it.`);
    await narrate(`Ye only have ${ship.crew} mateys left aboard.`);

    if (!ship.hasEnoughCrewForSailing()) {
        return initiateStranded();
    }

    return 0;
}

async function playWeatherEvent(event: WeatherEvent, ship: Ship) {
    const damageToDeal = (event.severity * ship.maxHealth);
    ship.takeDamage(damageToDeal);

    await narrate(`Ye sailed into a ${event.name}!`);

    if (ship.currentHealth <= 0) {
        await narrate(`Yer ship took ${damageToDeal} damage - she be torn asunder, and all hands lost to the deep.`);
        throw new GameOverError('Weather');
    }

    await narrate(`Yer ship took ${damageToDeal} damage - only ${ship.currentHealth} health left in her hull.`);

    return calculateTimeLossDueToWeatherEvent(event.severity);
}

async function playRescueEvent(event: RescueEvent, ship: Ship, rl: Interface) {
    await narrate(`Yarr! Wreckage on the horizon - the ${event.name} be in trouble!`);
    console.log(`Ye spy ${event.numberOfSailors} marooned sailors clingin' to the flotsam.`);
    console.log(`Ye 'ave ${ship.numberOfBeds - ship.crew} cots free aboard yer ship.`);
    while (true) {
        console.log(`How many do ye wants t' save?`);
        const answer = await prompt(rl);
        if (!isNumber(answer)) {
            console.log(`Yarr! That ain't a number.`);
            continue;
        };
        const convertedAnswer = parseInt(answer);

        const largestNumberAllowed = Math.min(event.numberOfSailors, ship.numberOfBeds - ship.crew);
        if (convertedAnswer >= 0 && convertedAnswer <= largestNumberAllowed) {
            await narrate(`Ye hauled ${convertedAnswer} sailors aboard. They owe ye their lives.`);
            ship.addCrew(convertedAnswer);
            break;
        }
        console.log(`Yarr! That number be invalid.`);
    }

    return 0;
}

async function playPirateEvent(event: PirateEvent, player: Player, rl: Interface) {
    await narrate(`A sail on the horizon! It be ${event.name} aboard the ${event.ship.name}!`);
    const enemyShip = new Ship(event.ship, getItems(20));
    await initiateCombat(player, enemyShip, rl);
    return 0;
}

async function initiateCombat(player: Player, enemyShip: Ship, rl: Interface) {
    let playersTurn = player.ship.speed > enemyShip.speed;
    await narrate(`Battle stations! ${enemyShip.name} closes in fer a fight!`);
    await narrate(playersTurn ? 'Ye have the wind - ye strike first!' : 'They have the wind - they strike first!');
    while (!eitherShipHasBeenDestroyed(player.ship.currentHealth, enemyShip.currentHealth)) {
        if (playersTurn) {
            shipAttack(player.ship, enemyShip);
        } else {
            shipAttack(enemyShip, player.ship)
        }
        playersTurn = !playersTurn;
        await sleepInMs(1000);
    }

    if (player.ship.currentHealth <= 0) {
        throw new GameOverError('Combat');
    }

    player.recordCombatWin();
    await narrate(`Hoist the colors! ${enemyShip.name} be defeated!`);
    await plunder(player, enemyShip, rl);
}

function seizeCargo(shipToGainCargo: Ship, seizedShip: Ship) {
    for (const item of seizedShip.cargo.inventory) {
        if (!shipToGainCargo.haveEnoughCapacityForCargo(item)) return
        shipToGainCargo.addCargo(item);
        seizedShip.removeCargo(item);
    }
}

function commandeerShip(player: Player, enemyShip: Ship) {
    const playerCrew = player.ship.crew;
    const playerUpgrades = player.ship.upgradeCount;

    // give enemy ship player cargo, then take enemy ship
    seizeCargo(enemyShip, player.ship);
    player.ship = enemyShip;
    player.ship.stats.crew += playerCrew;
    player.ship.stats.currentUpgradeSlots += playerUpgrades;
    player.ship.currentHealth = player.ship.maxHealth;

    reapplyUpgrades(player.ship);
    removeShipFromPool(enemyShip);
}

/** this assumes you are only going to ships with equal or more slots than you */
function reapplyUpgrades(playerShip: Ship) {
    for (const itemRef of playerShip.cargo.inventory) {
        const item = ItemLookup.get(itemRef.id);
        if (item?.type !== 'Upgrade') return;

        playerShip.applyItemEffectIfApplicable(item);
    }
}

function removeShipFromPool(pirateShip: Ship) {
    let weightOfEventsToRemove = 0;
    const totalPirateEventWeight = PirateEvents.reduce((acc, curr) => acc + curr.weight, 0)
    
    const pirateToRemove = PirateEvents.find(x => x.ship.name === pirateShip.name);
    weightOfEventsToRemove += pirateToRemove?.weight ?? 0;

    for (const [i, pirate] of PirateEvents.entries()) {
        if (pirate === pirateToRemove) {
            PirateEvents.splice(i, 1);
            continue;
        }
        const fractionOfTotalWeight = formatFloat((pirate.weight / totalPirateEventWeight), 3);
        pirate.weight += formatFloat(fractionOfTotalWeight * weightOfEventsToRemove, 1);
    }

    // check if any custom ships left, if not populate with the dummy ships
}
async function plunder(player: Player, enemyShip: Ship, rl: Interface) {
    console.log(`Ye've bested ${enemyShip.name}. Commandeer her? (y/n)`);
    let answer;
    do {
        answer = (await prompt(rl)).trim().toLowerCase();
    } while (!validPlunderAnswer(answer));

    if (answer === 'n') {
        seizeCargo(player.ship, enemyShip);
        await narrate(`Ye stripped ${enemyShip.name} o' her cargo and let her sink to the depths.`);
        return;
    }

    commandeerShip(player, enemyShip);
    await narrate(`A fine prize! Ye've taken command o' ${player.ship.name}.`);
}

function validPlunderAnswer(answer: string) {
    const isValid = answer === 'y' || answer === 'n';
    if (!isValid) console.log(`Yer answer be invalid. Try again.`);
    return isValid
}

function eitherShipHasBeenDestroyed(playerHealth: number, enemyHealth: number) {
    return playerHealth <= 0 || enemyHealth <= 0;
}

function shipAttack(attackingShip: Ship, defendingShip: Ship) {
    const attackRoll = rollCombatDice();
    const defenceRoll = rollCombatDice();

    const damage = formatFloat(
        (100 / (100 + defenceRoll * defendingShip.armour)) * attackRoll * attackingShip.damage,
        0
    );
    defendingShip.takeDamage(damage);

    console.log(`${attackingShip.name} attacked ${defendingShip.name} for ${damage} damage`);
    console.log(`${defendingShip.name} has ${defendingShip.currentHealth}/${defendingShip.maxHealth} health remaining`);
}

function rollCombatDice(): number {
    return Math.floor(Math.random() * 6) + 1;
}

/** ~~20% chance of death */
async function initiateStranded(): Promise<number> {
    const daysToSurvive = 10;
    let found = false;
    let i = 0;

    while (i < daysToSurvive && !found) {
        found = isFound();
        i++
    }

    if (!found) {
        throw new GameOverError('Stranded');
    }

    await narrate(`Ye were stranded fer ${i} days, but a passin' ship hauled ye aboard!`);
    return i;
}

function isFound() {
    return Math.random() >= 0.85;
}

function calculateTimeLossDueToWeatherEvent(eventSeverity: number) {
    return Math.floor(eventSeverity * 4)
}
