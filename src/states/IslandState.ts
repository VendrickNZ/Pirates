import type { State } from "../types/State";
import ViewShipState from "./viewShipState";

export default class IslandState implements State {
    constructor() {

    }

    input(): State {
        console.log('Input');
        return new ViewShipState()
    }

    update(): State {
        console.log('Update');
    }
}