import {APP} from "../utils/app";
import boards from "./boards";
import game from "./game";

export default APP.router(r => {
    r.use("/boards", boards)
    r.use("/game", game)
})
