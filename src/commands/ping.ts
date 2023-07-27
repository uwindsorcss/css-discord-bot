import {CommandType} from "../types";
import {logger} from "../logger";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, CacheType} from "discord.js";

const pongModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if bot is alive"),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    logger.info("Pong");
    await interaction.reply("Pong");
  },
};

export {pongModule as command};
