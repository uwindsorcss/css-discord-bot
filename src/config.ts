import {Collection} from "discord.js";
import {readFileSync} from "fs";
import yaml from "js-yaml";

import { logger } from "./logger";
import { BotModes } from "./types";

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

export const important_roles = [
  "Bot",
  "Admin",
  "Moderator",
  "CSS President",
  "CSS Board Executive",
  "CSS Board Head",
  "CSS Board Member",
]

type buildingType = {
  code: string,
  name: string
}
export const buildings: buildingType[] = [
  {
    code: "AC",
    name: "Assumption Chapel",
  },
  {
    code: "BB",
    name: "Biology Building",
  },
  {
    code: "CE",
    name: "Centre for Engineering Innovation",
  },
  {
    code: "CEI",
    name: "Centre for Engineering Innovation",
  },
  {
    code: "CH",
    name: "Cartier Hall",
  },
  {
    code: "CN",
    name: "Chrysler Hall North",
  },
  {
    code: "CS",
    name: "Chrysler Hall South",
  },
  {
    code: "DB",
    name: "Drama Building",
  },
  {
    code: "DH",
    name: "Dillon Hall",
  },
  {
    code: "ED",
    name: "Neal Education Building",
  },
  {
    code: "EH",
    name: "Essex Hall",
  },
  {
    code: "ER",
    name: "Erie Hall",
  },
  {
    code: "JC",
    name: "Jackman Dramatic Art Centre",
  },
  {
    code: "LB",
    name: "Ianni Law Building",
  },
  {
    code: "LL",
    name: "Leddy Library",
  },
  {
    code: "LT",
    name: "Lambton Tower",
  },
  {
    code: "MB",
    name: "O'Neil Medical Education Centre",
  },
  {
    code: "MC",
    name: "Macdonald Hall",
  }, {
    code: "MH",
    name: "Memorial Hall",
  },
  {
    code: "MU",
    name: "Music Building",
  },
  {
    code: "OB",
    name: "Odette Building",
  },
  {
    code: "TC",
    name: "Toldo Health Education Centre",
  },
  {
    code: "UC",
    name: "C.A.W. Student Centre",
  }, {
    code: "VH",
    name: "Vanier Hall",
  }, {
    code: "WC",
    name: "Welcome Centre",
  }, {
    code: "WL",
    name: "West Library",
  },
];

export const IMAGE_DIRECTORY_URL = "https://uwindsorcss.github.io/files/dir/images/buildings"
export { LoadConfig, Config, ConfigType };

