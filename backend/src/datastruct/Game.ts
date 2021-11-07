import {Board} from "./Board";
import {Player} from "./Player";
import {TICKET_TYPES, TicketTypeId} from "../utils/transportation";
import {last} from "../utils/array";
import EventEmitter from "events";

export default class Game extends EventEmitter {

    private turns: Turn[] = []

    constructor(
        public readonly board: Board,
        public readonly players: Player[] // Players (Mr. X excluded)
    ) {
        super()
        if (this.players.length <= 1) {
            throw new Error("At least two players")
        }
    }

    playerIndex(player: "mrx" | Player): "mrx" | number {
        if (player === "mrx") return player
        const index = this.players.indexOf(player)
        if (index >= 0) {
            return index
        } else {
            throw new Error("Player not in game")
        }
    }

    player(index: number) {
        if (index < this.players.length) {
            return this.players[index]
        }
        throw new Error(`Player with index ${index} not in game`)
    }

    nextTurn(): "mrx" | Player {
        if (this.turns.length === 0) {
            return "mrx"
        } else {
            const lastTurn = last(this.turns)!
            if (lastTurn.type === "mrx") {
                if (lastTurn.isDouble) {
                    return "mrx"
                } else {
                    return this.players[0]
                }
            } else {
                const lastPlayer = this.players.indexOf(lastTurn.player)
                if (lastPlayer === this.players.length - 1) {
                    return "mrx"
                } else {
                    return this.players[lastPlayer + 1]
                }
            }
        }
    }

    private checkNextTurn(actual: "mrx" | Player) {
        const expected = this.nextTurn()
        if (expected !== actual) {
            const str = (item: "mrx" | Player) => item === "mrx" ? "Mr. X" : `Player ${item.name}`
            throw new InvalidTurnError(`${str(actual)} made a move, while it was ${str(expected)}'s turn`)
        }
    }

    getCurrentPlayerNodes(): { player: Player, node: number }[] {
        return this.players.map(player => {
            const node = this.getCurrentPlayerNode(player)
            return {player, node}
        })
    }

    getCurrentPlayerNode(player: Player): number {
        const lastTurn = last(this.turns.filter(t => t.type === "player" && t.player == player)) as PlayerTurn | undefined
        return lastTurn?.node ?? player.initialNode
    }

    private excludePlayerNodes(nodes: number[]) {
        const currentPlayerNodes = this.getCurrentPlayerNodes().map(({node}) => node)
        return nodes.filter(node => !currentPlayerNodes.includes(node))
    }

    private getPossibleMoves(node: number, ticket: TicketTypeId) {
        return this.excludePlayerNodes(this.board.getLinksForTicket(node, ticket))
    }

    addMrXTurn(turn: Omit<MrXTurn, "possibleNodes" | "type">) {
        // Check if it is Mr. X's turn
        this.checkNextTurn("mrx")

        // Calculate possible positions
        let possibleNodes: number[] = []

        if (turn.node !== undefined) {
            // I have the current Mr. X position, no need to guess
            possibleNodes.push(turn.node)
        } else {
            const oldPossibleNodes = this.getPossibleMrXNodes()
            for (const node of oldPossibleNodes) {
                possibleNodes.push(...this.getPossibleMoves(node, turn.ticket))
            }
        }

        this.turns.push({
            ...turn,
            type: "mrx",
            possibleNodes
        })
        this.emit("turn")
    }

    addPlayerTurn(turn: Omit<PlayerTurn, "type" | "removedPossibleNodes">) {
        // Check it's my turn
        this.checkNextTurn(turn.player)

        // Check if move is right
        const currentNode = this.getCurrentPlayerNode(turn.player)
        const possibleMoves = this.getPossibleMoves(currentNode, turn.ticket)
        if (!possibleMoves.includes(turn.node)) {
            throw new InvalidMoveError(`Player ${turn.player.name} wrongly moved to ${turn.node} by ${turn.ticket} while he could only move to ${possibleMoves}`)
        }

        // If player moves into one the last possible Mr. X's nodes, remove that node from the possible list
        const lastMrXTurn = this.getLastMrXTurn()
        let removedPossibleNodes: number[] = []
        if (lastMrXTurn !== undefined && lastMrXTurn.possibleNodes.includes(turn.node)) {
            removedPossibleNodes = lastMrXTurn.possibleNodes.filter(n => n === turn.node)
            lastMrXTurn.possibleNodes = lastMrXTurn.possibleNodes.filter(n => n !== turn.node)
        }

        // If move is correct, add to turns
        this.turns.push({
            type: "player",
            removedPossibleNodes,
            ...turn
        })

        this.emit("turn")
    }

    private getLastMrXTurn() {
        return last(this.turns.filter(t => t.type === "mrx")) as MrXTurn | undefined
    }

    getPossibleMrXNodes() {
        const lastMrxTurn = this.getLastMrXTurn()
        return lastMrxTurn?.possibleNodes ?? this.excludePlayerNodes(this.board.nodeIds())
    }

    getPossiblePlayerMoves(): Record<number, Record<TicketTypeId, number[]>> {
        return Object.fromEntries(this.players.map(player => ([
            this.playerIndex(player),
            Object.fromEntries(TICKET_TYPES.map(ticketType => ([
                ticketType,
                this.getPossibleMoves(this.getCurrentPlayerNode(player), ticketType)
            ]))) as Record<TicketTypeId, number[]>
        ])))
    }
}

type MrXTurn = {
    type: "mrx"
    ticket: TicketTypeId
    node?: number
    isDouble?: boolean
    possibleNodes: number[]
}

type PlayerTurn = {
    type: "player"
    player: Player
    ticket: TicketTypeId
    node: number
    removedPossibleNodes: number[]
}

type Turn = MrXTurn | PlayerTurn

export class InvalidTurnError extends Error {

    constructor(message: string) {
        super(message)
    }
}

export class InvalidMoveError extends Error {

    constructor(message: string) {
        super(message)
    }
}