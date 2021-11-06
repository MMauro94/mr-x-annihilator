import {TransportationTypeId} from "./transportation";

export type BoardNode<T extends TransportationTypeId> = {
    [N in number]: {
        [K in T]?: number[]
    }
}

class Board<T extends TransportationTypeId> {
    constructor(
        public readonly transportations: T[],
        public readonly nodes: BoardNode<T>
    ) {}
}

new Board(
    ["taxi", "bus", "underground", "ferry"],
    {
        1: {
            taxi: [8, 9],
            bus: [46, 58],
            underground: [46],
        },
    }
)