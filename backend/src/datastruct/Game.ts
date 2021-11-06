import {Board} from "../utils/board";
import {Player} from "./Player";
import {TicketTypeId} from "../utils/transportation";

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
            const lastTurn = this.turns.at(-1)!
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
            const str = (item: "mrx" | Player) => item === "mrx" ? "Mr.X" : `Player ${item.name}`
            throw new InvalidTurnError(`${str(actual)} made a move, while it was ${str(expected)}'s turn`)
        }
    }

    private getCurrentPlayerNodes(): { player: Player, node: number }[] {
        return this.players.map(player => {
            const node = this.getCurrentPlayerNode(player)
            return {player, node}
        })
    }

    private getCurrentPlayerNode(player: Player): number {
        const lastTurn = this.turns.filter(t => t.type === "player" && t.player == player).at(-1) as PlayerTurn | undefined
        return lastTurn?.node ?? player.initialNode
    }

    private excludePlayerNodes(nodes: number[]) {
        const currentPlayerNodes = this.getCurrentPlayerNodes().map(({node}) => node)
        return nodes.filter(node => !currentPlayerNodes.includes(node))
    }

    private getPossibleNodes(node: number, ticket: TicketTypeId) {
        return this.excludePlayerNodes(this.board.getLinksForTicket(node, ticket))
    }

    private addMrXTurn(turn: Omit<MrXTurn, "possibleNodes" | "type">) {
        // Check if it is Mr. X's turn
        this.checkNextTurn("mrx")

        // Calculate possible positions
        let possibleNodes: number[] = []

        if (turn.node !== null) {
            // I have the current Mr. X position, no need to guess
            possibleNodes.push(turn.node)
        } else {
            const lastMrxTurn = this.turns.filter(t => t.type === "mrx").at(-1) as MrXTurn
            if (lastMrxTurn === undefined) {
                // First Mr.X move: he can be anywhere!
                possibleNodes.push(...Object.keys(this.board.nodes).map(parseInt))
            } else {
                for (const node of lastMrxTurn.possibleNodes) {
                    possibleNodes.push(...this.board.getLinksForTicket(node, turn.ticket))
                }
            }
        }

        // Exclude from possible nodes the ones where players are currently in
        possibleNodes = this.excludePlayerNodes(possibleNodes)

        this.turns.push({
            ...turn,
            type: "mrx",
            possibleNodes
        })
    }

    private addPlayerTurn(turn: PlayerTurn) {
        // Check it's my turn
        this.checkNextTurn(turn.player)

        // Check if move is right
        const currentNode = this.getCurrentPlayerNode(turn.player)
        const possibleMoves = this.excludePlayerNodes(this.board.getLinksForTicket(currentNode, turn.ticket))
        if (!possibleMoves.includes(turn.node)) {
            throw new InvalidMoveError(`Player ${turn.player.name} wrongly moved to ${turn.node} while he could only move to ${possibleMoves}`)
        }

        // If move is correct, add to turns
        this.turns.push(turn)
    }
}

type MrXTurn = {
    type: "mrx"
    ticket: TicketTypeId
    node: number | null
    possibleNodes: number[]
    isDouble: boolean
}

type PlayerTurn = {
    type: "player"
    player: Player
    ticket: TicketTypeId
    node: number
}

type Turn = MrXTurn | PlayerTurn

class InvalidTurnError extends Error {
}

class InvalidMoveError extends Error {
}