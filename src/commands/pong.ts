import {CommandType} from "../types";
import {logger} from "../logger";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, CacheType} from "discord.js";

const pongModule: CommandType = {
  allowGlobal: true,
  allowGuilded: true,
  data: new SlashCommandBuilder().setName("pong").setDescription("Ping. Pong?"),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    logger.info("PONG PONG PONG");
    await interaction.reply("PONG");
  },
};

export {pongModule as command};
