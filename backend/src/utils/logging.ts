import winston, {createLogger} from "winston"

export const LOGGER = createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format(info => {
            if (info as any instanceof Error) {
                return Object.assign({}, info, {
                    message: info.stack
                })
            }
            return info
        })(),
        winston.format.cli()
    ),
    transports: [
        new winston.transports.Console({
            level: "debug"
        })
    ]
})