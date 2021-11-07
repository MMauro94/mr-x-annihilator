import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import expressWs, {WithWebsocketMethod} from "express-ws";

type R = expressWs.Router
type App = {
    app: express.Application & WithWebsocketMethod
    wsInstance: expressWs.Instance
    router: (f: (r: R) => void) => R
    page: (f: (r: R) => void) => (r: R) => void
}


function makeApp(): App {
    const app = express()
    const wsInstance = expressWs(app)
    app.use(cors())
    app.use(helmet())
    app.use(bodyParser.json())

    return {
        app: wsInstance.app,
        wsInstance: wsInstance,
        router: f => {
            const r = express.Router()
            f(r)
            return r
        },
        page: f => f
    }
}

export const APP = makeApp()
