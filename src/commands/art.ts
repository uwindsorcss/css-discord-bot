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
    .setDescription("Some cool ASCII Art")
    .addStringOption((option) => {
      option
        .setName("name")
        .setDescription("Choose your ASCII Art")
        .setRequired(true)
        .addChoices(...choices);
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("string")
        .setDescription("Add a string to the ASCII Art")
        .setMinLength(1)
        .setMaxLength(20)
        .setRequired(false);
      return option;
    }),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const args: string = interaction.options.getString(
        "name",
        true
      ) as string;
      const string: string = interaction.options.getString(
        "string",
        false
      ) as string;

      const codeBlockAdded =
        "```" +
        ASCIIArts[args].art.replace(
          /%s/g,
          string ?? ASCIIArts[args].defaultString
        ) +
        "```";

      await interaction.reply(codeBlockAdded);
    } catch (error) {
      logger.error(`Art command failed: ${error}`);
    }
  },
};

export {artModule as command};
