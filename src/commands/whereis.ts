import { logger } from "../logger";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType } from "discord.js";
import { CommandType } from "../types";

const whereIsModule: CommandType = {
  data: new SlashCommandBuilder().setName("whereis").setDescription("Where do u wanna go?"),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    logger.info("hello from whereis");
    await interaction.reply("hello from whereis");

  },

};

export { whereIsModule as command };
