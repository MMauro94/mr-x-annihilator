import {APP} from "../../utils/app";
import {findGame, GAME_ID_REGEX} from "../../utils/games";
import {TICKET_TYPES} from "../../utils/transportation";


export default APP.page(r => {
    r.ws("/:id", (ws, req) => {
        const gameId = req.params.id
        if (!GAME_ID_REGEX.test(gameId)) {
            ws.close(4400, "Invalid game ID")
            return
        }
        const game = findGame(gameId)
        if (game === undefined) {
            ws.close(4404, "Game with given ID not found")
            return
        }

        ws.send(JSON.stringify({
            type: "players",
            players: game.players
        }))

        const sendState = () => {
            ws.send(JSON.stringify({
                type: "state",
                nextTurn: game.playerIndex(game.nextTurn()),
                possibleMrXNodes: game.getPossibleMrXNodes(),
                possiblePlayerMoves: game.getPossiblePlayerMoves()
            }))
        }

        sendState()

        game.on("turn", sendState)

        ws.on("message", (data, isBinary) => {
            if (!isBinary) {
                try {
                    const json = JSON.parse(data.toString())

                    if (json["type"] === "player") {
                        if (
                            typeof json["player"] === "number" &&
                            typeof json["node"] === "number" &&
                            TICKET_TYPES.includes(json["ticket"])
                        ) {
                            game.addPlayerTurn({
                                player: game.player(json["player"]),
                                node: json["node"],
                                ticket: json["ticket"]
                            })
                        }
                    } else if (json["type"] === "mrx") {
                        if (
                            TICKET_TYPES.includes(json["ticket"]) &&
                            (json["node"] === undefined || typeof json["node"] === "number") &&
                            (json["isDouble"] === undefined || typeof json["isDouble"] === "boolean")
                        ) {
                            game.addMrXTurn({
                                ticket: json["ticket"],
                                node: json["node"],
                                isDouble: json["isDouble"]
                            })
                        }
                    }
                } catch {
                    return
                }
            }
        })
    })
})