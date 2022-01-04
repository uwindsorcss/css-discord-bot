import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {Client, Collection} from "discord.js";
import {CommandType, PermissionType} from "./types";
import {Config} from "./config";
import {logger} from "./logger";
import {ResolveGuildCommandId} from "./helpers/resolvers";

export const GlobalRegisterSlashCommands = async (
  commands: Collection<string, CommandType>
) => {
  const commandArr = [];
  const clientId = Config.api_client_id;
  for (const command of commands.values())
    commandArr.push(command.data.toJSON());

  let rest = new REST({version: Config.api_version});
  rest.setToken(clientId);
  logger.debug(commandArr);

  // may throw error, let it bubble up and crash the bot
  const route = Routes.applicationCommands(clientId);
  await rest.put(route, {body: commandArr});

  logger.log(`Succesfully registered ${commandArr.length} global commands`);
};

export const GuildRegisterSlashCommands = async (
  commands: Collection<string, CommandType>, // command name -> command
  guild_id: string
) => {
  const commandArr = [];
  const clientId = Config.api_client_id as string;
  for (const command of commands.values()) {
    commandArr.push(command.data.toJSON());
  }
  const rest = new REST({version: Config.api_version});
  rest.setToken(clientId);
  logger.debug(commandArr);

  // may throw error, let it bubble up and crash the bot
  const route = Routes.applicationGuildCommands(clientId, guild_id);
  await rest.put(route, {body: commandArr});
};

export const GuildRegisterPermissions = async (
  permissions: Collection<string, PermissionType[]>, // command name -> permissions
  guild_id: string,
  client: Client
) => {
  const guild = await client.guilds.fetch(guild_id);
  if (!guild) return;

  const permArr = [];
  const clientId = Config.api_client_id;
  for (const [cmdName, cmdPerms] of permissions.entries()) {
    const cmdId = ResolveGuildCommandId(guild, cmdName);
    permArr.push(JSON.stringify({id: cmdId, permissions: cmdPerms}));
  }

  const rest = new REST({version: Config.api_version});
  rest.setToken(clientId);
  logger.debug(permArr);

  // may throw error, let it bubble up and crash the bot
  const route = Routes.guildApplicationCommandsPermissions(clientId, guild_id);
  await rest.put(route, {body: permArr});
};
