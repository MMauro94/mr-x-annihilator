import Game from "../datastruct/Game";
import randomstring, {generate} from "randomstring"

const GAMES: Record<string, Game> = {}

export const GAME_ID_REGEX = /^[A-Z0-9]{8}$/

function generateId(): string {
    const id = randomstring.generate({
        length: 8,
        capitalization: "uppercase",
        charset: "alphanumeric"
    })
    if (id in GAMES) {
        return generateId()
    } else {
        return id
    }
}

export function addGame(game: Game) {
    const id = generateId()
    GAMES[id] = game
    return id
}

export function findGame(id: string): Game | undefined {
    return GAMES[id]
}