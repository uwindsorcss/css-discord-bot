import {Client, GatewayIntentBits} from "discord.js";
import {logger, prisma} from "@/config";
import {ClientType} from "./types";
import events from "./events";
import commands from "./commands";
import process from "process";
import "dotenv/config";

const shutDown = async () => {
  await client.destroy();
  await prisma.$disconnect();
  logger.info("Gracefully shutting down...");
  process.exit(0);
};

// Gracefully exit on SIGINT and SIGTERM
process.on("SIGINT", shutDown);
process.on("SIGTERM", shutDown);

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
}) as ClientType;

(async () => {
  // load in the events
  await events(client);

  // load in the commands
  await commands(client);

  // login the client
  await client.login(process.env.DISCORD_API_TOKEN);
})();
