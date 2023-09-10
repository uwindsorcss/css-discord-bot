import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {Collection} from "discord.js";
import {CommandType} from "./types";
import {Config} from "./config";
import {logger} from "./logger";

// Globally register slash commands
// Can take up to an hour for it to show up
const GlobalRegisterSlashCommands = async (
  commands: Collection<string, CommandType>
) => {
  const commandArr = [];
  for (const command of commands.values()) {
    commandArr.push(command.data.toJSON());
  }
  const rest = new REST({version: Config?.api_version}).setToken(
    Config?.api_token as string
  );

  //logger.debug(commandArr);
  // this can throw an error
  // if it does, let it bubble up and crash the bot
  await rest.put(Routes.applicationCommands(Config?.api_client_id as string), {
    body: commandArr,
  });
};

const GuildRegisterSlashCommands = async (
  commands: Collection<string, CommandType>,
  guild_id: string
) => {
  const commandArr = [];
  for (const command of commands.values()) {
    commandArr.push(command.data.toJSON());
  }
  const rest = new REST({version: Config?.api_version}).setToken(
    Config?.api_token as string
  );

  //logger.debug(commandArr);
  // this can throw an error
  // if it does, let it bubble up and crash the bot
  await rest.put(
    Routes.applicationGuildCommands(Config?.api_client_id as string, guild_id),
    {
      body: commandArr,
    }
  );
};

export {GlobalRegisterSlashCommands, GuildRegisterSlashCommands};
