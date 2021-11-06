import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import bodyParser from "body-parser";
import {LOGGER} from "./utils/logging";
import {Config} from "./utils/config";
import api from './api';

const app = express()
app.use(cors())
app.use(helmet())
app.use(bodyParser.json())

app.use("/api", api)
app.all("/api/*", (req, res) => res.status(404).send())


// Initialize app backend server
app.listen(Config.PORT, Config.BIND, () => {
    LOGGER.info(`⚡️Backend started on ${Config.BIND}:${Config.PORT}`)
})