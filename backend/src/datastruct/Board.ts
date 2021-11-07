import {TicketTypeId, TRANSPORTATION_TYPE_INFO, TransportationTypeId} from "../utils/transportation";

export type BoardNodes = Readonly<Record<number, Partial<Readonly<Record<TransportationTypeId, readonly number[]>>>>>

export class Board {
    constructor(
        public readonly nodes: BoardNodes
    ) {
    }

    nodeIds() {
        return Object.keys(this.nodes).map(n => parseInt(n))
    }

    getLinksForTicket(node: number, ticket: TicketTypeId): number[] {
        const links = this.nodes[node]
        if (links === undefined) {
            throw new Error(`Invalid node ${node}`)
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

    public static remapNodes(from: BoardNodes, remap: Record<number, number>): BoardNodes {
        const copy = {...from}
        for (const [oldNode, newNode] of Object.entries(remap)) {
            const oldInt = parseInt(oldNode)
            const old = copy[oldInt]
            if (old === undefined) {
                throw new Error(`Unable to find old node ${oldNode}`)
            }
            delete copy[oldInt]
            copy[newNode] = old
        }
        return copy
    }
}
