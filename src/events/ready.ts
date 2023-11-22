import { logger } from "@/config";
import { initMathJax } from "@/helpers/LatexHelpers";
import { Client, Events } from "discord.js";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    if (!client.user || !client.application) {
      return;
    }

    await initMathJax();
    client.user.setActivity("🔒 locked in");
    client.user.setStatus("dnd");
    logger.info(`${client.user.username} is online.`);
  },
};
