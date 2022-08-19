import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import {
  Client,
  Collection,
  Awaitable,
  CommandInteraction,
  CacheType,
  Message,
  AutocompleteInteraction
} from "discord.js";

interface CommandType {
  data:
    | SlashCommandBuilder // normal slash command builder instance
    | SlashCommandSubcommandsOnlyBuilder
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">; // slash command without any subcommands
  execute: (
    interaction: CommandInteraction<CacheType>,
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

export {CommandType, EventType, ClientType, BotModes};
