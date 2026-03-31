export function getRandomInt(min: number, max: number) {
    const rawVal = Math.random() * (max - min) + min;
    return parseInt(rawVal.toFixed(0));
}

export function getRandomFloat(min: number, max: number, dp = 1) {
    const rawVal = Math.random() * (max - min) + min;
    return parseFloat(rawVal.toFixed(dp));
}