//import fs from "fs";
//import {REST} from "@discordjs/rest";
//import {Routes} from "discord-api-types/v9";
import {LoadConfig, Config} from "./config";
import {logger} from "./logger";

const start = async () => {
  // even though this is inside `src/`, pretend that it isnt
  await LoadConfig("config.yaml");

  logger.info({Config});
  /*
const commandFiles: string[] = fs
  .readdirSync("./commands")
  .filter((file: string) => file.endsWith(".ts"));

for (const file of commandFiles) {
}*/
};

start();
