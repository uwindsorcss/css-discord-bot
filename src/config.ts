import {readFileSync} from "fs";
import yaml from "js-yaml";
import {logger} from "./logger";
import {BotModes} from "./types";

type ConfigType = {
  api_token: string;
  api_client_id: string;
  bot_user_id: number;
  api_version: string;
  mode: BotModes;
  development_guild_id: string;
  debug: boolean;
  self_roles_channel: string;
  urls: {mc_address_url: string};
  prompt: {
    channel: string;
    top_text: string;
    bottom_text: string;
  };
  features: {
    year: boolean;
    purge: boolean;
    equation: boolean;
    whereis: boolean;
    selfRoles: boolean;
    say: boolean;
    prompt: boolean;
    jail: boolean;
    train: boolean;
  };
};

let Config: null | ConfigType = null;

const LoadConfig = (file: string) => {
  const data = yaml.load(readFileSync(file, "utf8"));
  Config = data as ConfigType;

  // if Config.debug is set, then set log level to debug, if naw then info
  logger.level = Config.debug ? "debug" : "info";
};

export {LoadConfig, Config, ConfigType};
