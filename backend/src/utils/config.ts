import {env, envInt} from "./env";
import dotenv from "dotenv";

dotenv.config()

export module Config {

    export const BIND = env("BIND", "0.0.0.0")
    export const PORT = envInt("PORT", 80)

}