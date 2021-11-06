import {TicketTypeId, TRANSPORTATION_TYPE_INFO, TransportationTypeId} from "./transportation";

export type BoardNode = Record<number, Partial<Record<TransportationTypeId, number[]>>>

export class Board {
    constructor(
        public readonly nodes: BoardNode
    ) {}

    getLinksForTicket(node: number, ticket: TicketTypeId): number[] {
        const links = this.nodes[node]
        if (links === undefined) {
            throw new Error("Invalid node")
        }

        const possibleTransportations = Object.entries(TRANSPORTATION_TYPE_INFO)
            .filter(([, info]) => info.allowedTickets.includes(ticket))
            .map(([type]) => type as TransportationTypeId)

        let nodes = []
        for (const t of possibleTransportations) {
            nodes.push(...(links[t] ?? []))
        }
        return nodes
    }
}
