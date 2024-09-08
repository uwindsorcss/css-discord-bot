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
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";

interface buildingType {
  code: string;
  name: string;
}

interface CommandType {
  data:
    | SlashCommandBuilder // normal slash command builder instance
    | SlashCommandOptionsOnlyBuilder
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

interface ASCIIArt {
  [key: string]: {
    art: string;
    defaultString: string;
  };
}

export {ConfigType, buildingType, CommandType, EventType, ASCIIArt, ClientType};
