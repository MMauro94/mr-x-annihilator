import {TransportationTypeId} from "./transportation";

export type BoardNode<T extends TransportationTypeId> = {
    [N in number]: {
        [K in T]?: number[]
    }
}

export class Board<T extends TransportationTypeId> {
    constructor(
        public readonly transportations: T[],
        public readonly nodes: BoardNode<T>
    ) {}
}
