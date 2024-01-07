import {Client, GatewayIntentBits} from "discord.js";
import {logger, prisma, Config} from "@/config";
import {ClientType} from "./types";
import events from "./events";
import commands from "./commands";
import process from "process";
import "dotenv/config";

// Gracefully exit on SIGINT
process.on('SIGINT', async () => {
  logger.info("Gracefully shutting down...");
  await client.destroy();
  await prisma.$disconnect();
  process.exit(0);
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
}) as ClientType;

(async () => {
  // load in the events
  await events(client);

  // load in the commands
  await commands(client);

  // login the client
  logger.info("Logging in...");
  await client.login(Config.discord_api_token);
})();
