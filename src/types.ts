import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
  Client,
  Collection,
  Awaitable,
  CacheType,
  Message,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

interface ConfigType {
  api_token: string;
  api_client_id: string;
  bot_user_id: number;
  api_version: string;
  mode: BotModes;
  development_guild_id: string;
  debug: boolean;
  self_roles_channel: string;
  year_roles: {
    [key: string]: string;
  };
  prompt: {
    channel: string;
    top_text: string;
    bottom_text: string;
  };
  features: {
    linkAdmin: boolean;
    link: boolean;
    ping: boolean;
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
}

interface buildingType {
  code: string;
  name: string;
}

interface CommandType {
  data:
    | SlashCommandBuilder // normal slash command builder instance
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">; // slash command without any subcommands
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>,
    message?: Message | null
  ) => Promise<any>;
  autoComplete?: (interaction: AutocompleteInteraction) => Promise<any>;
}

interface EventType {
  name: string;
  once: boolean;
  execute: (...arg: any[]) => Awaitable<void> | void;
}

interface ClientType extends Client {
  commands: Collection<string, CommandType>;
}

enum BotModes {
  production,
  development,
}

interface ASCIIArt {
  [key: string]: string;
}

export {
  ConfigType,
  buildingType,
  CommandType,
  EventType,
  ASCIIArt,
  ClientType,
  BotModes,
};
