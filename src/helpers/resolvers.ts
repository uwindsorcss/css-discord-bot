import {Client, Guild} from "discord.js";
import path from "path";
import {GlobalCommandIDs, GuildCommandIDs} from "./commandIdCache";

const ResolveCommandPath = (name: string) =>
  path.format({
    root: "./commands/",
    name: name,
  });

const ResolveEventPath = (name: string) =>
  path.format({
    root: "./events/",
    name: name,
  });

const ResolveRoleId = (guild: Guild, name: string): string | undefined => {
  return guild.roles.cache.findKey((role) => role.name === name);
};

const ResolveGlobalCommandId = (
  client: Client,
  name: string
): string | undefined => {
  let cached = GlobalCommandIDs.get(name);
  if (cached) return cached;

  return client.application?.commands.cache.findKey((cmd) => cmd.name === name);
};

const ResolveGuildCommandId = (
  guild: Guild,
  name: string
): string | undefined => {
  let cached = GuildCommandIDs.get(guild.id)?.get(name);
  if (cached) return cached;

  return guild.commands.cache.findKey((cmd) => cmd.name === name);
};

export {
  ResolveCommandPath,
  ResolveEventPath,
  ResolveRoleId,
  ResolveGlobalCommandId,
  ResolveGuildCommandId,
};
