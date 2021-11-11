import {NUM_CMP} from "../src/utils/array";
import {RAVENSBURGER_MISSING_108} from "../src/datastruct/boards/ravensburger-missing-108";
import {RAVENSBURGER_1983_SECOND_EDITION} from "../src/datastruct/boards/ravensburger-1983-second-edition";

test('testRAVENSBURGER_1983_SECOND_EDITION', () => {

    const board = RAVENSBURGER_1983_SECOND_EDITION

    expect(board.getLinksForTicket(108, "taxi").sort(NUM_CMP)).toEqual([105, 117, 119])
    expect(board.getLinksForTicket(108, "bus").sort(NUM_CMP)).toEqual([105, 116, 135])
    expect(board.getLinksForTicket(108, "underground")).toEqual([])

    expect(board.getLinksForTicket(118, "taxi").sort(NUM_CMP)).toEqual([116, 129, 134, 142])
    expect(board.getLinksForTicket(118, "bus").sort(NUM_CMP)).toEqual([])
    expect(board.getLinksForTicket(118, "underground")).toEqual([])
})


test('testRAVENSBURGER_MISSING_108', () => {
    const board = RAVENSBURGER_MISSING_108

    expect(board.nodes[108]).toBeUndefined()
    expect(() => board.getLinksForTicket(108, "taxi")).toThrow()

    expect(board.getLinksForTicket(118, "taxi").sort(NUM_CMP)).toEqual([105, 117, 119])
    expect(board.getLinksForTicket(118, "bus").sort(NUM_CMP)).toEqual([105, 116, 135])
})