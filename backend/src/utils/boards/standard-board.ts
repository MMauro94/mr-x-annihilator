import {Board} from "../board";

export default function standardBoard() {
    return new Board(
        ["taxi", "bus", "underground", "ferry"],
        {
            1: {
                taxi: [8, 9],
                bus: [46, 58],
                underground: [46],
            },
            2: {
                taxi: [],
                bus: [],
                underground: [],
            },
        }
    )
}