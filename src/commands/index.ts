import {promises as fs} from "fs";
import path from "path";
import {ClientType, CommandType} from "@/types";
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
  logger.debug("Loading commands...");
  client.commands = new Collection();

  // all command files except index.ts
  const commandFiles: string[] = (await fs.readdir(__dirname))
    .filter((file: string) => (file.endsWith(".ts") || file.endsWith(".js")))
    .filter(
      (file: string) =>
        file !== "index.ts" && file !== "index.js" && (Config.features as any)[file.slice(0, -3)]
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
    version: Config.discord.api_version,
  }).setToken(Config.discord.api_token);

  // if in production mode, register globally, can take up to an hour to show up
  // else register in development guild
  if (process.env.NODE_ENV === "production") {
    logger.debug("Registering commands globally...");
    await rest.put(
      Routes.applicationCommands(Config.discord.client_id),
      {
        body: commandArr,
      }
    );
  } else {
    logger.debug("Registering commands in development guild...");
    await rest.put(
      Routes.applicationGuildCommands(
        Config.discord.client_id,
        Config.discord.guild_id
      ),
      {
        body: commandArr,
      }
    );
  }
};
