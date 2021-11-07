import {Board} from "../utils/board";
import {Player} from "./Player";
import {TicketTypeId} from "../utils/transportation";
import {last} from "../utils/array";

export default class Game {

    private turns: Turn[] = []
    private won = false

    constructor(
        public readonly board: Board,
        public readonly players: Player[] // Players (Mr. X excluded)
    ) {
        if (this.players.length <= 1) {
            throw new Error("At least two players")
        }
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
            const oldPossiblePositions = this.getPossibleMrXPositions()
            for (const node of oldPossiblePositions) {
                possibleNodes.push(...this.getPossibleMoves(node, turn.ticket))
            }
        }

        this.turns.push({
            ...turn,
            type: "mrx",
            possibleNodes
        })
    }

    addPlayerTurn(turn: Omit<PlayerTurn, "type">) {
        // Check it's my turn
        this.checkNextTurn(turn.player)

        // Check if move is right
        const currentNode = this.getCurrentPlayerNode(turn.player)
        const possibleMoves = this.getPossibleMoves(currentNode, turn.ticket)
        if (!possibleMoves.includes(turn.node)) {
            throw new InvalidMoveError(`Player ${turn.player.name} wrongly moved to ${turn.node} by ${turn.ticket} while he could only move to ${possibleMoves}`)
        }

        // If move is correct, add to turns
        this.turns.push({
            type: "player",
            ...turn
        })

        // If player moves into one the last possible Mr. X's nodes, remove that node from the possible list
        const lastMrXTurn = this.getLastMrXTurn()
        if (lastMrXTurn !== undefined && lastMrXTurn.possibleNodes.includes(turn.node)) {
            lastMrXTurn.possibleNodes = lastMrXTurn.possibleNodes.filter(n => n != turn.node)
        }
    }

    private getLastMrXTurn() {
        return last(this.turns.filter(t => t.type === "mrx")) as MrXTurn | undefined
    }

    getPossibleMrXPositions() {
        const lastMrxTurn = this.getLastMrXTurn()
        return lastMrxTurn?.possibleNodes ?? this.excludePlayerNodes(this.board.nodeIds())
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