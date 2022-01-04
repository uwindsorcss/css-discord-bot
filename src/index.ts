import path from "path";
import fs from "fs";
import {CacheType, Client, Collection, Intents, Interaction} from "discord.js";
import {LoadConfig, Config} from "./config";
import {logger} from "./logger";
import {ClientType, CommandType, PermissionType} from "./types";
import {
  GlobalRegisterSlashCommands,
  GuildRegisterPermissions,
  GuildRegisterSlashCommands,
} from "./registerer";
import {ResolveCommandPath, ResolveRoleId} from "./helpers/resolvers";

// start bot async function
// needs to be async so we can `await` inside
const start = async () => {
  // even though this is inside `src/`, pretend that it isnt
  // load in the config
  LoadConfig("config.yaml");
  logger.debug({Config});

  // create client as ClientType
  const client: ClientType = new Client({
    intents: [Intents.FLAGS.GUILDS],
  }) as ClientType;
  client.token = Config.api_token;
  client.commands = new Collection<string, CommandType>();

  // create a list of commands that exist in the /commands directory
  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.slice(0, -3));

  /*
   * Global command initialization
   */
  let globalCommands = new Collection<string, CommandType>();
  if (Config.global_features) {
    for (let commandName of Config.global_features) {
      if (commandFiles.includes(commandName)) {
        // dynamic import and add to globalCommands map
        const filePath = ResolveCommandPath(commandName);
        const {command} = await import(filePath);

        if (!(command as CommandType).allowGlobal) {
          const err = `Attempted to load non-global command ${commandName} as global command.`;
          logger.error(err);
          throw new Error(err);
        }

        logger.debug(`loaded ${filePath + ".ts"} as global command`);
        logger.debug({command});
        globalCommands.set(commandName, command as CommandType);
        client.commands.set(commandName, command as CommandType);
      }
    }

    await GlobalRegisterSlashCommands(globalCommands);
  }

  /*
   * Guild command initialization
   */
  if (Config.guilds !== undefined) {
    for (let [guildId, guild] of Config.guilds.entries()) {
      const activeGuild = await client.guilds.fetch(guildId);
      if (!activeGuild) continue; // bot isn't in the guild with this id

      let guildCommands = new Collection<string, CommandType>();
      let guildPermissions = new Collection<string, PermissionType[]>();

      for (let commandName of guild.features) {
        // skip this command if it doesn't exist or it is listed under global_features
        if (!commandFiles.includes(commandName)) continue;

        // haven't already loaded the command
        if (!globalCommands.has(commandName)) {
          // dynamic import command
          const filePath = ResolveCommandPath(commandName);
          const {command} = await import(filePath);

          // ensure command permits guilded usage
          if (!(command as CommandType).allowGuilded) {
            const err = `Attempted to load non-guilded command ${commandName} as guilded command.`;
            logger.error(err);
            throw new Error(err);
          }

          logger.debug(
            `loaded ${filePath + ".ts"} as guild (${guildId}) command`
          );
          logger.debug({command});

          guildCommands.set(commandName, command as CommandType);
          client.commands.set(commandName, command as CommandType);
        }

        // partially resolve permissions. We may not have registered the command yet (only global have been
        // registered at this point) so we can't determine its ID yet. GuildRegisterPermissions will resolve
        // the ID for each command for us, so we just give it a name.
        let cmdPerms = new Array<PermissionType>();
        for (const [roleName, permissions] of guild.role_perms.entries()) {
          let state = permissions.get(commandName);
          if (!state) continue; // not specified

          cmdPerms.push({
            id: ResolveRoleId(activeGuild, roleName)!,
            type: "ROLE",
            permission: state,
          });
        }
        guildPermissions.set(commandName, cmdPerms);
      }

      await GuildRegisterSlashCommands(guildCommands, guildId);
      await GuildRegisterPermissions(guildPermissions, guildId, client);
    }
  }

  /*
   * Event intialization
   */
  // TODO: implement this

  /*
   * Final client setup (interaction/event handling)
   */
  // Command dispatcher
  client.on("interactionCreate", async (intr: Interaction<CacheType>) => {
    logger.debug({intr});
    if (!intr.isCommand()) return;

    const command = client.commands.get(intr.commandName) as CommandType;
    if (!command) return;

    try {
      await command.execute(intr);
    } catch (error) {
      logger.error(error);
      return intr.reply({
        content: "There was an error while executing this command.",
        ephemeral: true,
      });
    }
  });

  // Client ready event
  client.once("ready", () => logger.info("Bot is ready."));

  // Log in the client (bot now shows as online)
  client.login(Config.api_token);

  // event loader
  //   for (const file of eventFiles) {
  //     const filePath = path.format({
  //       root: "./events/",
  //       name: file,
  //     });

  //     logger.debug(`Load event file ${filePath}`);
  //     const event = await import(filePath.slice(0, -3));
  //     if (event.once) {
  //       client.once(event.name, (...args) => event.execute(...args));
  //     } else {
  //       client.on(event.name, (...args) => event.execute(...args));
  //     }
  //   }
};

// start bot
start();
