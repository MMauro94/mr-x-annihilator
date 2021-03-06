export const TICKET_TYPES = ["taxi", "bus", "underground", "black"] as const
export type TicketTypeId = typeof TICKET_TYPES[number]


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