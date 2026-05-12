import { ItemLookup } from "../types/Item";
import type GameManager from "./GameManager";
import type Player from "./Player";

const COMBAT_VALUE = 500;
const CREW_VALUE = 50;
const COMPLETION_BONUS = 1000;

export type ScoreBreakdown = {
    gold: number;
    cargo: number;
    combats: number;
    crew: number;
    completion: number;
    combatsWon: number;
    crewSurvived: number;
    daysSurvived: number;
    maxDays: number;
    total: number;
}

export function computeFinalScore(player: Player, gameManager: GameManager): ScoreBreakdown {
    const gold = player.balance;
    const cargo = computeCargoValue(player);
    const combatsWon = player.combatsWon;
    const crewSurvived = player.ship.crew;
    const maxDays = gameManager.maxDays;
    const daysSurvived = maxDays - gameManager.daysRemaining;

    const combats = combatsWon * COMBAT_VALUE;
    const crew = crewSurvived * CREW_VALUE;
    const completion = (daysSurvived / maxDays) * COMPLETION_BONUS;

    const total = Math.round(gold + cargo + combats + crew + completion);
    return { gold, cargo, combats, crew, completion, combatsWon, crewSurvived, daysSurvived, maxDays, total };
}

function computeCargoValue(player: Player): number {
    return player.ship.cargo.inventory.reduce((acc, ref) => {
        const item = ItemLookup.get(ref.id);
        if (!item) return acc;
        return acc + item.baseValue * ref.units;
    }, 0);
}

export function printScoreBreakdown(score: ScoreBreakdown) {
    console.log('==============================');
    console.log('        FINAL SCORE');
    console.log('==============================');
    console.log(`Gold:                ${score.gold.toFixed(0)}`);
    console.log(`Cargo value:         ${score.cargo.toFixed(0)}`);
    console.log(`Combats won (${score.combatsWon}):     ${score.combats}`);
    console.log(`Crew survived (${score.crewSurvived}):   ${score.crew}`);
    console.log(`Survival (${score.daysSurvived}/${score.maxDays} days): ${score.completion.toFixed(0)}`);
    console.log('------------------------------');
    console.log(`TOTAL:               ${score.total}`);
    console.log('==============================');
}
