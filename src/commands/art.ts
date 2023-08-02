import {CommandType} from "../types";
import {logger} from "@/config";
import {
  CacheType,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import {ASCIIArts} from "../helpers/ASCIIArts";

const choices: {name: string; value: string}[] = Object.keys(ASCIIArts).map(
  (key) => ({
    name: key,
    value: key,
  })
);

const artModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("art")
    .setDescription("Try out some cool ASCII Arts?")
    .addStringOption((option) => {
      option
        .setName("name")
        .setDescription("Choose your ASCII Art")
        .setRequired(true)
        .addChoices(...choices);
      return option;
    }),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const args: string = interaction.options.getString(
        "name",
        true
      ) as string;

      let codeBlockAdded = "```" + ASCIIArts[args] + "```";

      await interaction.reply(codeBlockAdded);
    } catch (error) {
      logger.error(`Art command failed: ${error}`);
    }
  },
};

export {artModule as command};
