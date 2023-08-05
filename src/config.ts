import {readFileSync} from "fs";
import yaml from "js-yaml";
import pino from "pino";
import {ConfigType, buildingType} from "./types";
import {PrismaClient} from "@prisma/client";

// create a logger instance
export const logger = pino();

// set the image directory url
export const IMAGE_DIRECTORY_URL =
  "https://uwindsorcss.github.io/files/dir/images/buildings";

// load in the config file
export const Config: ConfigType = yaml.load(
  readFileSync("config.yaml", "utf8")
) as ConfigType;
logger.debug({Config});

// if Config.debug is set, then set log level to debug, if naw then info
logger.level = Config.debug ? "debug" : "info";

// create a new prisma client
export const prisma = new PrismaClient();
