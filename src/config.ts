import {Collection} from "discord.js";
import {readFileSync} from "fs";
import yaml from "js-yaml";
import {logger} from "./logger";
import {BotModes} from "./types";

type GuildType = {
  name: string;
  features: string[];
  role_perms: Collection<string, string[]>;
};

type ConfigType = {
  // api config
  api_token: string;
  api_client_id: string;
  bot_user_id: number;
  api_version: string;

  // bot mode config
  mode: BotModes;
  debug: boolean;
  devguild?: string;

  // featurization
  guilds?: Collection<string, GuildType>;
  global_features?: string[];

  // feature configs
  self_roles_channel: string;
  prompt: {
    top_text: string;
    bottom_text: string;
  };
  urls: {
    mc_address_url: string;
  };
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
      guild.role_perms = new Collection<string, string[]>(
        Object.entries(guild.role_perms)
      );
    }
  }

  // if bot in dev mode, then set log level to debug, if naw then info
  logger.level =
    Config.mode === BotModes.development || Config.debug ? "debug" : "info";
};

export {LoadConfig, Config, ConfigType};
