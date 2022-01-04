import {Collection} from "discord.js";
import {readFileSync} from "fs";
import yaml from "js-yaml";
import {logger} from "./logger";
import {BotModes} from "./types";

type GuildType = {
  name: string;
  features: Array<string>;
  role_perms: Collection<string, Collection<string, boolean>>;
};

type ConfigType = {
  api_token: string;
  api_client_id: string;
  bot_user_id: number;
  api_version: string;
  mode: BotModes;
  guilds?: Collection<string, GuildType>;
  global_features?: Array<string>;
};

let Config: ConfigType;

const LoadConfig = (file: string) => {
  const data = yaml.load(readFileSync(file, "utf8"));
  Config = data as ConfigType;

  // actually convert the Collections to Collections, otherwise they
  // are Maps which don't have the functionality we expect
  if (Config.guilds) {
    Config.guilds = new Collection<string, GuildType>(
      Object.entries(Config.guilds)
    );
    for (let guild of Config.guilds.values()) {
      guild.role_perms = new Collection<string, Collection<string, boolean>>(
        Object.entries(guild.role_perms)
      );
      for (let [role, rules] of guild.role_perms) {
        guild.role_perms.set(
          role,
          new Collection<string, boolean>(Object.entries(rules))
        );
      }
    }
  }

  console.log(Config);

  // if bot in dev mode, then set log level to debug, if naw then info
  logger.level = Config.mode == BotModes.development ? "debug" : "info";
};

export {LoadConfig, Config, ConfigType};
