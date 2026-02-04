import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { ILogger } from "../../app/providers/ILogger.js"; 

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

                new DailyRotateFile({
                    filename: "logs/error-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    level: "error",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "7d",
                }),

                new DailyRotateFile({
                    filename: "logs/combined-%DATE%.log",
                    datePattern: "YYYY-MM-DD",
                    zippedArchive: true,
                    maxSize: "20m",
                    maxFiles: "14d",
                }),
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
