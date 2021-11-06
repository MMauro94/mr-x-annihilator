export type TicketTypeId = "taxi" | "bus" | "underground" | "black"


export type TransportationTypeId = "taxi" | "bus" | "underground" | "ferry"

export type TransportationTypeInfo = {
    allowedTickets: TicketTypeId[]
}

export const TRANSPORTATION_TYPE_INFO: Record<TransportationTypeId, TransportationTypeInfo> = {
    taxi: {
        allowedTickets: ["taxi", "black"]
    },
    bus: {
        allowedTickets: ["bus", "black"]
    },
    underground: {
        allowedTickets: ["underground", "black"]
    },
    ferry: {
        allowedTickets: ["black"]
    }
}