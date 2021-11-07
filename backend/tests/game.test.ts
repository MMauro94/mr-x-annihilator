import Game, {InvalidMoveError, InvalidTurnError} from "../src/datastruct/Game";
import {distinct, NUM_CMP} from "../src/utils/array";
import {RAVENSBURGER_MISSING_108} from "../src/datastruct/boards/ravensburger-missing-108";

test('testGame', () => {

    const player1 = {
        id: 1,
        name: "Tizio",
        color: "#FF0000",
        initialNode: 46
    }
    const player2 = {
        id: 2,
        name: "Caio",
        color: "#00FF00",
        initialNode: 67
    }
    const player3 = {
        id: 3,
        name: "Sempronio",
        color: "#0000FF",
        initialNode: 2
    }
    // Mr. X starts on 23

    const game = new Game(RAVENSBURGER_MISSING_108, [player1, player2, player3])


    // Check player positions
    expect(game.getCurrentPlayerNode(player1)).toBe(46)
    expect(game.getCurrentPlayerNode(player2)).toBe(67)
    expect(game.getCurrentPlayerNode(player3)).toBe(2)
    const playerInitialNodes = game.getCurrentPlayerNodes().map(({node}) => node).sort(NUM_CMP)
    expect(playerInitialNodes).toEqual([2, 46, 67])

    expect(game.nextTurn()).toEqual("mrx")
    expect(() => game.addPlayerTurn({player: player1, ticket: "taxi", node: 47})).toThrow(InvalidTurnError)


    expect(distinct(game.getPossibleMrXNodes()).sort(NUM_CMP))
        .toEqual(distinct(game.board.nodeIds().filter(n => !playerInitialNodes.includes(n))).sort(NUM_CMP))


    // First round
    game.addMrXTurn({ticket: "taxi"}) // Goes to 37
    expect(game.getPossibleMrXNodes().includes(37)).toBe(true)
    expect(game.nextTurn()).toEqual(player1)

    expect(() => game.addPlayerTurn({player: player1, ticket: "taxi", node: 46})).toThrow(InvalidMoveError)
    game.addPlayerTurn({player: player1, ticket: "taxi", node: 47})
    game.addPlayerTurn({player: player2, ticket: "underground", node: 13})
    game.addPlayerTurn({player: player3, ticket: "taxi", node: 20})


    // Second round
    game.addMrXTurn({ticket: "taxi", node: 50}) // Goes to 50
    expect(game.getPossibleMrXNodes()).toEqual([50])

    game.addPlayerTurn({player: player1, ticket: "taxi", node: 34})
    game.addPlayerTurn({player: player2, ticket: "taxi", node: 24})
    game.addPlayerTurn({player: player3, ticket: "taxi", node: 33})


    // Third round
    game.addMrXTurn({ticket: "taxi"}) // Goes to 49
    expect(game.getPossibleMrXNodes().sort(NUM_CMP)).toEqual([37, 38, 49])

    game.addPlayerTurn({player: player1, ticket: "bus", node: 63})
    game.addPlayerTurn({player: player2, ticket: "taxi", node: 37})
    game.addPlayerTurn({player: player3, ticket: "taxi", node: 46})


    // Fourth round
    game.addMrXTurn({ticket: "taxi"}) // Goes to 66
    expect(game.getPossibleMrXNodes().sort(NUM_CMP)).toEqual([
        /*37*/ [/* empty because because player 2 moved into it */],
        /*38*/ [24, 25, 50, 51],
        /*49*/ [36, 50, 66]
    ].flat().sort())

    game.addPlayerTurn({player: player1, ticket: "bus", node: 65})
    game.addPlayerTurn({player: player2, ticket: "taxi", node: 50})
    game.addPlayerTurn({player: player3, ticket: "underground", node: 13})


    // Fifth round
    game.addMrXTurn({ticket: "taxi"}) // Goes to 67
    expect(game.getPossibleMrXNodes().sort(NUM_CMP)).toEqual([
        /*37*/ [],
        /*38*/ [
            /*24*/ [37, 38],
            /*25*/ [14, 38, 39],
            /*50*/ [/* empty because because player 2 moved into it */],
            /*51*/ [38, 39, 52, 67, 68]
        ],
        /*49*/ [
            /*36*/ [35, 37, 49],
            /*50*/ [/* empty because because player 2 moved into it */],
            /*66*/ [49, 67, 82]
        ]
    ].flat(2).sort(NUM_CMP))

    game.addPlayerTurn({player: player1, ticket: "taxi", node: 82})
    game.addPlayerTurn({player: player2, ticket: "taxi", node: 38})
    game.addPlayerTurn({player: player3, ticket: "bus", node: 52})


    // Fifth round
    game.addMrXTurn({ticket: "underground"}) // Goes to 89
    expect(game.getPossibleMrXNodes().sort(NUM_CMP)).toEqual([
        /*38*/ [
            /*24*/ [
                /*37*/ [/* no underground */],
                /*38*/ [/* no underground */]
            ],
            /*25*/ [
                /*14*/ [/* no underground */],
                /*38*/  [/* no underground */],
                /*39*/ [/* no underground */]
            ],
            /*51*/ [
                /*38*/ [/* no underground */],
                /*39*/ [/* no underground */],
                /*52*/ [/* no underground */],
                /*67*/ [13, 79, 111, 89],
                /*68*/ [/* no underground */]
            ]
        ],
        /*49*/ [
            /*36*/ [
                /*35*/ [/* no underground */],
                /*37*/ [/* no underground */],
                /*49*/ [/* no underground */]
            ],
            /*66*/ [
                /*49*/ [/* no underground */],
                /*67*/ [13, 79, 111, 89],
                /*82*/ [/* no underground */]
            ]
        ]
    ].flat(3).sort(NUM_CMP))

    game.addPlayerTurn({player: player1, ticket: "bus", node: 100})
    game.addPlayerTurn({player: player2, ticket: "taxi", node: 24})
    game.addPlayerTurn({player: player3, ticket: "bus", node: 86})


    // Sixth round
    game.addMrXTurn({ticket: "bus", node: 105}) // Goes to 105
    expect(game.getPossibleMrXNodes()).toEqual([105])

    game.addPlayerTurn({player: player1, ticket: "bus", node: 111})
    game.addPlayerTurn({player: player2, ticket: "taxi", node: 13})
    game.addPlayerTurn({player: player3, ticket: "bus", node: 87})


    // Sixth round
    game.addMrXTurn({ticket: "taxi"}) // Goes to 118
    expect(game.getPossibleMrXNodes().sort(NUM_CMP)).toEqual([89, 90, 91, 106, 118])

    game.addPlayerTurn({player: player1, ticket: "underground", node: 67})
    game.addPlayerTurn({player: player2, ticket: "underground", node: 89})
    game.addPlayerTurn({player: player3, ticket: "bus", node: 105})


    // Seventh round
    game.addMrXTurn({ticket: "black", isDouble: true}) // Goes to 115
    expect(game.getPossibleMrXNodes().sort(NUM_CMP)).toEqual([
        /*89*/ [/* empty because because player 2 moved into it */],
        /*90*/ [72, 91],
        /*91*/ [56, 72, 90, 107],
        /*106*/ [107],
        /*118*/ [115, 116, 117, 119, 135]
    ].flat().sort(NUM_CMP))

    // Mr. X has double move
    expect(() => game.addPlayerTurn({player: player1, ticket: "bus", node: 102})).toThrow(InvalidTurnError)

    game.addMrXTurn({ticket: "black"}) // Goes to 157
    expect(game.getPossibleMrXNodes().sort(NUM_CMP)).toEqual([
        /*90*/ [
            /*72*/ [42, 42, 71, 90, 91, 107],
            /*91*/ [56, 72, 90, 107],
        ],
        /*91*/ [
            /*56*/ [42, 91],
            /*72*/ [42, 42, 71, 90, 91, 107],
            /*90*/ [72, 91],
            /*107*/ [72, 91, 106, 119, 161],
        ],
        /*106*/ [
            /*107*/ [72, 91, 106, 119, 161],
        ],
        /*118*/ [
            /*115*/ [102, 114, 118, 126, 127, 157],
            /*116*/ [86, 104, 117, 118, 127, 127, 128, 142],
            /*117*/ [88, 116, 118, 129],
            /*119*/ [107, 118, 136],
            /*135*/ [118, 129, 136, 143, 159, 161, 161],
        ]
    ].flat(2).sort(NUM_CMP))
})