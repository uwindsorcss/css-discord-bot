import {Client, GatewayIntentBits, Partials} from "discord.js";
import {logger, prisma, Config} from "@/config";
import events from "./events";
import commands from "./commands";
import process from "process";

// Gracefully exit on SIGINT
process.on("SIGINT", function () {
  logger.info("Gracefully shutting down...");
  client.destroy();
  prisma.$disconnect();
  process.exit();
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.User,
  ],
}) as ClientType;

(async () => {
  await events(client);
  await commands(client);
  logger.info("Logging in...");
  await client.login(Config.discord.api_token);
})();
