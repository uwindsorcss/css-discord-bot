import fs from "fs";
import path from "path";
//import {REST} from "@discordjs/rest";
//import {Routes} from "discord-api-types/v9";
import {LoadConfig, Config, ConfigType} from "./config";
import {logger} from "./logger";

const start = async () => {
  // even though this is inside `src/`, pretend that it isnt
  // load in the config
  LoadConfig("config.yaml");

  logger.info({Config});

  // get all the module files
  const moduleFiles: string[] = fs
    .readdirSync("src/modules")
    .filter((file: string) => file.endsWith(".ts"));

  // enumerate through the module files
  // and load them in
  for (const feature of Object.keys((Config as any)?.features)) {
    const filePath = path.format({
      root: "./modules/",
      name: feature,
    });

    if ((Config as any).features[feature]) {
      const name = await import(filePath);
      (name as any).something();
    }
  }
};

start();
