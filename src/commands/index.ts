import {promises as fs} from "fs";
import path from "path";
import {BotModes, ClientType, CommandType} from "@/types";
import {Config, logger} from "@/config";
import "dotenv/config";
import {
  Collection,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from "discord.js";

export const commandArr: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

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
  for (const command of client.commands.values()) {
    commandArr.push(command.data.toJSON());
  }

  const rest = new REST({
    version: process.env.DISCORD_API_VERSION as string,
  }).setToken(process.env.DISCORD_API_TOKEN as string);

  // if in production mode, register globally, can take up to an hour to show up
  // else register in development guild
  if (Config?.mode === BotModes.production) {
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string),
      {
        body: commandArr,
      }
    );
  } else {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID as string,
        process.env.DISCORD_GUILD_ID as string
      ),
      {
        body: commandArr,
      }
    );
  }
};
