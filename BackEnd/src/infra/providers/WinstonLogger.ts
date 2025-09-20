import { createLogger, format, transports } from "winston";
import { ILogger } from "app/providers/ILogger"; 

export class WinstonLogger implements ILogger {
    private logger;

    constructor() {
        this.logger = createLogger({
            level: "info",
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.printf(({ timestamp, level, message, ...meta }) => {
                    return `[${timestamp}] ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ""}`;
                })
            ),
            transports: [
                new transports.Console(),
                new transports.File({ filename: "logs/error.log", level: "error" }),
                new transports.File({ filename: "logs/combined.log" }),
            ],
        });
    }

    info(message: string, meta?: Record<string, unknown>) {
        this.logger.info(message, meta);
    }

    warn(message: string, meta?: Record<string, unknown>) {
        this.logger.warn(message, meta);
    }

    error(message: string, meta?: Record<string, unknown>) {
        this.logger.error(message, meta);
    }

    debug(message: string, meta?: Record<string, unknown>) {
        this.logger.debug(message, meta);
    }
}
