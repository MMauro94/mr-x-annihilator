import {Board} from "../Board";
import {RAVENSBURGER_MISSING_108} from "./ravensburger-missing-108";

export const RAVENSBURGER_1983_SECOND_EDITION = new Board(
    {
        ...Board.remapNodes(RAVENSBURGER_MISSING_108.nodes, {
            118: 108,
            128: 118,
            159: 128,
            171: 159,
            200: 171
        })
    }
)

