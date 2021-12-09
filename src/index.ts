import path from "path";
import fs from "fs";
import {Client, Intents, Collection} from "discord.js";
//import {Routes} from "discord-api-types/v9";
import {LoadConfig, Config} from "./config";
import {logger} from "./logger";
import {ClientType, CommandType} from "./types";

const start = async () => {
  // even though this is inside `src/`, pretend that it isnt
  // load in the config
  LoadConfig("config.yaml");

  logger.debug({Config});

  // create client as ClientType
  const client: ClientType = new Client({
    intents: [Intents.FLAGS.GUILDS],
  }) as ClientType;

  client.commands = new Collection();

  // return a string array of file names
  // where the file name ends in `.ts` and it is enabled
  // in featurization
  const commandFiles: string[] = fs.readdirSync("./src/commands/").filter(
    (file: string) =>
      file.endsWith(".ts") && (Config as any)?.features[file.slice(0, -3)] // slice to get rid of extension
  );

  // dynamically import and load commands
  for (const file of commandFiles) {
    const filePath = path.format({
      root: "./commands/",
      name: file,
    });

    // actual dynamic import
    const command: CommandType = (await import(
      filePath.slice(0, -3)
    )) as CommandType;

    logger.debug(`Load command file ${filePath}`);

    // load into commands map
    client.commands.set(command.data.name, command);
  }

  // array of event files
  // where the files end in `.ts` and are enabled in featurization
  const eventFiles: string[] = fs.readdirSync("./src/events/").filter(
    (file: string) =>
      file.endsWith(".ts") && (Config as any)?.features[file.slice(0, -3)] // slice to get rid of extension
  );

  // event loader
  for (const file of eventFiles) {
    const filePath = path.format({
      root: "./events/",
      name: file,
    });

    logger.debug(`Load event file ${filePath}`);
    const event = await import(filePath.slice(0, -3));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  // Bot ready event
  client.once("ready", () => {
    logger.info("Bot is ready");
  });

  // command dispatcher
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(error);
      return interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });

  // login the client
  client.login(Config?.api_token);
};

start();
