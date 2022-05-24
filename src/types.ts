import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder } from "@discordjs/builders";
import {
  Client,
  Collection,
  Awaitable,
  CommandInteraction,
  CacheType,
  Message,
} from "discord.js";

interface CommandType {
  allowGlobal: boolean;
  data:
  | SlashCommandBuilder // normal slash command builder instance
  | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">; // slash command without any subcommands
  execute: (interaction: CommandInteraction<CacheType>, message?: Message | null) => Promise<any>;
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
  id: string;
  type: "ROLE" | "USER";
  permission: boolean;
};

enum BotModes {
  production = "production",
  development = "development",
}

export {CommandType, PermissionType, EventType, ClientType, BotModes};

