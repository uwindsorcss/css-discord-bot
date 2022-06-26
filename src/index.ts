import path from "path";
import fs from "fs";
import {Client, Intents, Collection, Interaction, CacheType} from "discord.js";
import {LoadConfig, Config} from "./config";
import {logger} from "./logger";
import {
  GlobalRegisterSlashCommands,
  GuildRegisterSlashCommands,
} from "./registerer";
import {BotModes, ClientType, CommandType} from "./types";

// start bot async function
// needs to be async so we can `await` inside
const start = async () => {
  // even though this is inside `src/`, pretend that it isnt
  // load in the config
  LoadConfig("config.yaml");

  //logger.debug({Config});

  // create client as ClientType
  const client: ClientType = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  }) as ClientType;

  client.commands = new Collection();

  // return a string array of file names
  // where the file name ends in `.ts` and it is enabled
  // in featurization

  // dynamic command loader
  const commandFiles = fs.readdirSync("./src/commands") //
  .filter((name) => name.endsWith(".ts"));

    // dynamically import and load commands
  for (const file of commandFiles) {
    const filePath = path.format({
      root: "./commands/",
      name: file,
    });

    // actual dynamic import
    const {command} = await import(filePath.slice(0, -3));

    //logger.debug(`Load command file ${filePath}`);
    // logger.info({command});

    // load into commands map
    client.commands.set(command.data.name, command as CommandType);
  }

  // if in production mode, register slash commands with all servers
  // if in development mode, register with specific server
  if (Config?.mode === BotModes.production) {
    // register the slash commands to all servers
    // that the bot is a part of
    await GlobalRegisterSlashCommands(client.commands);
  } else {
    // register the slash command with the dev server(guild)

    await GuildRegisterSlashCommands(
      client.commands,
      Config?.development_guild_id as string
    );
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
    logger.info("Bot is ready haha haha");
  });

  // command dispatcher
  client.on(
    "interactionCreate",
    async (interaction: Interaction<CacheType>) => {
      //logger.debug({interaction});
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
    }
  );

  // client.on('messageCreate', (mess) =>{
  //   if(mess.content == 'ping'){
  //     mess.reply({
  //       content: 'pong'
  //     })
  //   }
  // })
  // login the client
  client.login(Config?.api_token);
};

// start bot
start();
