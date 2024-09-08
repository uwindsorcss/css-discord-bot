import ConfigJson from "../config.json";
export const Config = ConfigJson;
import pino from "pino";
import {PrismaClient} from "@prisma/client";
import {join} from "path";
import {seedDatabase} from "./helpers/seed";

const transport = pino.transport({
  targets: [
    {
      target: "pino-roll",
      options: {
        file: join("logs", "log"),
        frequency: 604800016, // Every 7 days or
        size: "10m", // 10MB
        mkdir: true,
      },
      level: "info",
    },
    {
      target: "pino-pretty",
      options: {colorize: true, translateTime: "yyyy-mm-dd hh:MM:ss"},
      level: Config.debug ? "debug" : "info",
    },
  ],
});

// create a logger instance
export const logger = pino(
  {
    level: Config.debug ? "debug" : "info",
    base: null,
  },
  transport
);

logger.debug({Config});

// create a new prisma client
export const prisma = new PrismaClient();
if (Config.seed) seedDatabase();
