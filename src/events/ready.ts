import {logger, Config} from "@/config";
import {initMathJax} from "@/helpers/LatexHelpers";
import {Client, Events} from "discord.js";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    if (!client.user || !client.application) {
      return;
    }

    await initMathJax();

    // Set status
    if (Config.discord_status && Config.discord_status !== "") {
      client.user.setActivity({
        name: "status",
        type: 4,
        state: Config.discord_status,
      });
    }

    logger.info(`${client.user.username} is online.`);
  },
};
