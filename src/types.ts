import {SlashCommandBuilder} from "@discordjs/builders";
import {
  Client,
  Collection,
  Awaitable,
  CommandInteraction,
  CacheType,
} from "discord.js";

interface CommandType {
  allowGlobal: boolean;
  allowGuilded: boolean;
  data:
    | SlashCommandBuilder // normal slash command builder instance
    | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">; // slash command without any subcommands
  execute: (interaction: CommandInteraction<CacheType>) => Promise<any>;
}

interface EventType {
  name: string;
  once: boolean;
  execute: (...arg: any[]) => Awaitable<void> | void;
}

interface ClientType extends Client {
  commands: Collection<string, CommandType>;
}

type PermissionType = {
  type: "ROLE" | "USER";
  id: string;
  permission: boolean;
};

enum BotModes {
  production,
  development,
}

export {CommandType, PermissionType, EventType, ClientType, BotModes};
