import {APP} from "../utils/app";
import game from "./game";

export default APP.router(r => {
    r.use("/game", game)
})
