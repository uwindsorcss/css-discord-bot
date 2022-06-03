import { CommandType } from "../types";
import { logger } from "../logger";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, CacheType } from "discord.js";
import { dog, goat, train } from "../helpers/ASCIIArts";

const pongModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("train")
    .setDescription("Train?"),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {

      let codeBlockAdded = "```" + train + "```"
      // let codeBlockAdded2 = "```" + goat + "```"
      // let codeBlockAdded3 = "```" + dog + "```"

      // await interaction.reply(codeBlockAdded2 + '\n\n' + codeBlockAdded + '\n\n' + codeBlockAdded3);
       await interaction.reply(codeBlockAdded);
    } catch (error) {

    }
    // logger.info("PONG PONG PONG");

  },
};

export { pongModule as command };
