import {validate} from "../../utils/express";
import {body} from "express-validator";
import {BOARDS} from "../../datastruct/boards";
import {Player} from "../../datastruct/Player";
import Game from "../../datastruct/Game";
import {addGame} from "../../utils/games";
import {APP} from "../../utils/app";

export default APP.page(r => {
    r.post("/", ...[
        validate(
            body("board").isIn(Object.keys(BOARDS)),
            body("players").isArray(),
            body("players.*.name").isString().isLength({min: 1}),
            body("players.*.color").isHexColor(),
            body("players.*.initialNode").isInt({min: 1}).toInt(),
        )
    ], (req, res) => {

        const boardId = req.body.board as keyof typeof BOARDS
        const board = BOARDS[boardId]

        const players = req.body.players as Player[]

        const game = new Game(board, players)
        const gameId = addGame(game)

        res.send({id: gameId})
    })
})
