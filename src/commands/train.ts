import { CommandType } from "../types";
import { logger } from "../logger";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType } from "discord.js";
import { ASCIIArts } from "../helpers/ASCIIArts";

const artModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("art")
    .setDescription("Try out some cool ASCII Arts?")
    .addStringOption(option => {
      option
        .setName('name')
        .setDescription('Choose your ASCII Art')
        .setRequired(true)
      for (var i = 0; i < Object.keys(ASCIIArts).length; i++) {
        option.addChoice(Object.keys(ASCIIArts)[i], Object.keys(ASCIIArts)[i])
      }
      return option
    }
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      const args:string = interaction.options.getString("name", true) as string;

      let codeBlockAdded = "```" + ASCIIArts[args] + "```"
     
      await interaction.reply(codeBlockAdded);

    } catch (error) {
      logger.error(`Art command failed: ${error}`);
    }
   
  },
};

export { artModule as command };
