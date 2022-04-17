import {logger} from "../logger";
import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction, CacheType} from "discord.js";
import {CommandType} from "../types";

const promptModule: CommandType = {
  data: new SlashCommandBuilder().setName("prompt").setDescription("Prompt?"),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    logger.info("hello from prompt");
    await interaction.reply("hello from prompt");
  },
  
};

export {promptModule as command};
