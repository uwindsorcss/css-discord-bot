import { logger } from "../logger";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  CacheType,
} from "discord.js";
import { CommandType } from "../types";
import { EquationRender, Santinize } from "../helpers/LatexHelpers";

const equationnModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("equationn")
    .setDescription("Say something?")
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("equationn")
        .setDescription("The equationn you want me to say")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      let message = interaction.options.getString("equationn")!;
      let cleanedMessage = Santinize(message)

      EquationRender(cleanedMessage, interaction)
        
    } catch (error) {
      logger.error(`Equation command failed: ${error}`);
    }
  },
};

export { equationnModule as command };