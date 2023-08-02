import {Config, logger} from "@/config";
import {initMathJax} from "@/helpers/LatexHelpers";
import {ConnectToDB} from "@/helpers/linkQueries";
import {BotModes} from "@/types";
import {Client, Events} from "discord.js";

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client: Client) {
    if (!client.user || !client.application) {
      return;
    }

    await initMathJax();
    if (Config?.mode !== BotModes.production) {
      await ConnectToDB();
    }

    logger.info(`${client.user.username} is online.`);
  },
};
