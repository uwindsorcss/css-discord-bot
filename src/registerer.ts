import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {Client, Collection} from "discord.js";
import {CommandType, PermissionType} from "./types";
import {Config} from "./config";
import {logger} from "./logger";
import {ResolveGuildCommandId} from "./helpers/resolvers";
import {GlobalCommandIDs, GuildCommandIDs} from "./helpers/commandIdCache";

type RegisteredCommand = {id: string; name: string};

const GlobalRegisterSlashCommands = async (
  commands: Collection<string, CommandType>
) => {
  const commandArr = [];
  for (const command of commands.values())
    commandArr.push(command.data.toJSON());

  let rest = new REST({version: Config.api_version}).setToken(Config.api_token);
  logger.debug(commandArr);

  // may throw error, let it bubble up and crash the bot
  const route = Routes.applicationCommands(Config.api_client_id);
  const res = (await rest.put(route, {
    body: commandArr,
  })) as RegisteredCommand[];

  // cache the name and ID
  for (const command of res) {
    GlobalCommandIDs.set(command.name, command.id);
  }

  logger.info(`Registered ${commandArr.length} global commands`);
};

const GlobalClearCommands = async () => {
  GlobalCommandIDs.clear();

  let r = new REST({version: Config.api_version}).setToken(Config.api_token);
  await r.put(Routes.applicationCommands(Config.api_client_id), {body: []});
};

const GuildRegisterSlashCommands = async (
  commands: Collection<string, CommandType>,
  guild_id: string,
  overwrite: boolean = false
) => {
  let commandArr = [];
  const clientId = Config.api_client_id as string;
  for (const command of commands.values()) {
    commandArr.push(command.data.toJSON());
  }
  const rest = new REST({version: Config.api_version});
  rest.setToken(Config.api_token);
  logger.debug(commandArr);

  const route = Routes.applicationGuildCommands(clientId, guild_id);

  // may throw error, let it bubble up and crash the bot
  if (!overwrite) {
    const existing = (await rest.get(route)) as RegisteredCommand[];
    commandArr = [...existing, ...commandArr];
  }
  const response = (await rest.put(route, {
    body: commandArr,
  })) as RegisteredCommand[];

  for (const command of response) {
    let guildCache = GuildCommandIDs.get(guild_id);
    if (!guildCache) {
      GuildCommandIDs.set(guild_id, new Collection<string, string>());
      guildCache = GuildCommandIDs.get(guild_id);
    }

    guildCache?.set(command.name, command.id);
  }

  logger.info(`Registered ${commandArr.length} commands in guild ${guild_id}`);
};

/**
 * NOTE: This will also clear the permissions for the guild!
 * @param guild_id the id of the guild to clear commands in
 */
const GuildClearCommands = async (guild_id: string) => {
  // reset cache
  GuildCommandIDs.get(guild_id)?.clear();

  let r = new REST({version: Config.api_version}).setToken(Config.api_token);
  await r.put(Routes.applicationGuildCommands(Config.api_client_id, guild_id), {
    body: [],
  });
};

const GuildRegisterPermissions = async (
  permissions: Collection<string, PermissionType[]>,
  guild_id: string,
  client: Client
) => {
  const guild = client.guilds.cache.get(guild_id);
  if (!guild) return;

  let fullPermissions: {id: string; permissions: PermissionType[]}[] = [];
  for (const [commandName, cmdPermissions] of permissions.entries()) {
    let commandId = ResolveGuildCommandId(guild, commandName);
    if (!commandId) continue;

    fullPermissions.push({id: commandId, permissions: cmdPermissions});
  }

  logger.debug({fullPermissions});
  logger.debug(JSON.stringify(fullPermissions));

  await guild.commands.permissions.set({fullPermissions});
  logger.info(`Registered ${fullPermissions.length} commands' permissions`);
};

export {
  GlobalRegisterSlashCommands,
  GlobalClearCommands,
  GuildRegisterSlashCommands,
  GuildClearCommands,
  GuildRegisterPermissions,
};
