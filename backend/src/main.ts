import {Config} from "./utils/config";
import {LOGGER} from "./utils/logging";
import api from "./api"
import {APP} from "./utils/app";


APP.app.use("/api", api)
APP.app.all("/api/*", (req, res) => res.status(404).send())

APP.app.listen(Config.PORT, Config.BIND, () => {
    LOGGER.info(`⚡️Backend started on ${Config.BIND}:${Config.PORT}`)
})