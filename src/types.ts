import {SlashCommandBuilder} from "@discordjs/builders";
import {
  Client,
  Collection,
  Awaitable,
  CommandInteraction,
  CacheType,
} from "discord.js";

interface CommandType {
  data: SlashCommandBuilder;
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

enum BotModes {
  production,
  development,
}

export {CommandType, EventType, ClientType, BotModes};
