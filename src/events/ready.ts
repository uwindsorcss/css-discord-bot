import {logger, Config} from "@/config";
import {Client, Events} from "discord.js";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    if (!client.user || !client.application) {
      return;
    }

    // Set status
    if (Config.discord.status && Config.discord.status !== "") {
      client.user.setActivity({
        name: "status",
        type: 4,
        state: Config.discord.status,
      });
    }

    logger.info(`${client.user.username} is online.`);
  },
};
