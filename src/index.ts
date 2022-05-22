import fs from "fs";
import {CacheType, Client, Collection, Intents, Interaction} from "discord.js";
import {LoadConfig, Config} from "./config";
import {logger} from "./logger";
import {BotModes, ClientType, CommandType, PermissionType} from "./types";
import {
  GlobalClearCommands,
  GlobalRegisterSlashCommands,
  GuildClearCommands,
  GuildRegisterPermissions,
  GuildRegisterSlashCommands,
} from "./registerer";
import {
  ResolveCommandPath,
  ResolveEventPath,
  ResolveRoleId,
} from "./helpers/resolvers";

// start bot async function
// needs to be async so we can `await` inside
const start = async () => {
  // even though this is inside `src/`, pretend that it isnt
  // load in the config
  LoadConfig("config.yaml");
  logger.debug({Config});

  // create client as ClientType, then establish connection with Discord
  const client: ClientType = new Client({
    intents: [Intents.FLAGS.GUILDS],
  }) as ClientType;
  client.commands = new Collection<string, CommandType>();

  client.once("ready", () => logger.info("Bot has logged in."));
  await client.login(Config.api_token);

  /*
   * Clear all registered commands
   */
  let promises: Promise<any>[] = [];
  promises.push(GlobalClearCommands());
  if (Config.guilds) {
    for (const guildId of Config.guilds?.keys()) {
      promises.push(GuildClearCommands(guildId));
    }
  }

  await Promise.allSettled(promises);

  /*
   * Global command initialization
   */
  // create a list of commands that exist in the /commands directory
  const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.slice(0, -3)); // remove `.ts` from the end

  // load any that are enabled
  let globalCmds = new Collection<string, CommandType>();
  if (Config.global_features) {
    for (let commandName of Config.global_features) {
      if (commandFiles.includes(commandName)) {
        // dynamic import and add to globalCommands map
        const filePath = ResolveCommandPath(commandName);
        const {command} = (await import(filePath)) as {command: CommandType};

        if (!command.allowGlobal) {
          const err = `Attempted to load non-global command ${commandName} as global command.`;
          logger.error(err);
          throw new Error(err);
        }

        logger.debug(`loaded ${filePath + ".ts"} as global command`);
        logger.debug({command});
        globalCmds.set(commandName, command);
        client.commands.set(commandName, command);
      }
    }

    // if bot is in devmode and a development guild is specified,
    // register the global commands in that guild instead of globally
    if (Config.mode === BotModes.development && Config.devguild) {
      logger.info(`In dev mode, redirecting globals to ${Config.devguild}`);
      await GuildRegisterSlashCommands(globalCmds, Config.devguild);
    } else {
      await GlobalRegisterSlashCommands(globalCmds);
    }
  }

  /*
   * Guild command initialization
   */
  if (Config.guilds) {
    for (let [guildId, guild] of Config.guilds.entries()) {
      const activeGuild = await client.guilds.fetch(guildId);
      if (!activeGuild) continue; // bot isn't in the guild with this id

      let guildCmds = new Collection<string, CommandType>();
      let guildPermissions = new Collection<string, PermissionType[]>();

      // load any non-global commands this guild wants
      for (let commandName of guild.features) {
        // skip non-existing files and those that have already been loaded
        if (!commandFiles.includes(commandName)) continue;
        if (!globalCmds.has(commandName)) {
          // dynamic import command
          const filePath = ResolveCommandPath(commandName);
          const {command} = (await import(filePath)) as {command: CommandType};

          // set guilded command permissions to false by default. (permission
          // must be given to specific roles in the config)
          command.data.setDefaultPermission(false);

          // log loaded command for debugging
          logger.debug(`loaded ${filePath + ".ts"} as command in ${guildId}`);
          logger.debug({command});

          guildCmds.set(commandName, command);
          client.commands.set(commandName, command);
        } else {
          const command = globalCmds.get(commandName)!;
          guildCmds.set(commandName, command);
        }
      }

      // resolve guild-specific permissions for its features
      for (const commandName of [...guildCmds.keys(), ...globalCmds.keys()]) {
        let commandPermissions: PermissionType[] = [];
        for (const [roleName, roleRules] of guild.role_perms.entries()) {
          if (roleRules.includes(commandName)) {
            const roleId = ResolveRoleId(activeGuild, roleName);
            if (!roleId) continue;

            commandPermissions.push({
              id: roleId,
              type: "ROLE",
              permission: true,
            } as PermissionType);
          }
        }
        guildPermissions.set(commandName, commandPermissions);
      }

      logger.debug(`Registering commands for ${guildId}`);
      await GuildRegisterSlashCommands(guildCmds, guildId);

      logger.debug(`Registering permissions for ${guildId}`);
      await GuildRegisterPermissions(guildPermissions, guildId, client);
    }
  }

  /*
   * Event intialization
   */
  const eventFiles = fs
    .readdirSync("./src/events")
    .filter((name) => name.endsWith(".ts"))
    .map((name) => name.slice(0, -3));

  for (const file of eventFiles) {
    const filePath = ResolveEventPath(file);

    logger.debug(`Load event file ${filePath}`);
    const event = await import(filePath.slice(0, -3));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  /*
   * Final client setup (interaction/event handling)
   */
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

  logger.info("Bot setup has finished");
};

// start bot
start();
