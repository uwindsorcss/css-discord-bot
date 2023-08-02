import {Client, GatewayIntentBits} from "discord.js";
import {LoadConfig, Config, logger} from "@/config";
import {ClientType} from "./types";
import events from "./events";
import commands from "./commands";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
}) as ClientType;

(async () => {
  // load in the config
  LoadConfig("config.yaml");
  logger.debug({Config});

  // load in the events
  await events(client);

  // load in the commands
  await commands(client);

  // login the client
  await client.login(Config?.api_token);
})();
