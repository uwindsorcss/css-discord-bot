import {promises as fs} from "fs";
import path from "path";
import {BotModes, ClientType, CommandType} from "@/types";
import {Config, logger} from "@/config";
import {Collection, REST, Routes} from "discord.js";

export default async (client: ClientType) => {
  client.commands = new Collection();

  // all command files except index.ts
  const commandFiles: string[] = (await fs.readdir(__dirname))
    .filter((file: string) => file.endsWith(".ts"))
    .filter(
      (file: string) =>
        file !== "index.ts" && (Config as any)?.features[file.slice(0, -3)]
    );

  // command loader
  for (const file of commandFiles) {
    const filePath = path.join(__dirname, file);
    const {command} = await import(filePath.slice(0, -3));

    logger.debug(`Load command file ${filePath}`);
    logger.debug({command});

    // load into commands map
    client.commands.set(command.data.name, command as CommandType);
  }

  // register slash commands
  const commandArr = [];
  for (const command of client.commands.values()) {
    commandArr.push(command.data.toJSON());
  }

  const rest = new REST({version: Config?.api_version}).setToken(
    Config?.api_token as string
  );

  // if in production mode, register globally, can take up to an hour to show up
  // else register in development guild
  if (Config?.mode === BotModes.production) {
    await rest.put(
      Routes.applicationCommands(Config?.api_client_id as string),
      {
        body: commandArr,
      }
    );
  } else {
    await rest.put(
      Routes.applicationGuildCommands(
        Config?.api_client_id as string,
        Config?.development_guild_id as string
      ),
      {
        body: commandArr,
      }
    );
  }
};
