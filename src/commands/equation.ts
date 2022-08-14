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

const equationModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("equation")
    .setDescription("Say something?")
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("equation")
        .setDescription("The equation you want me to say")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      let message = interaction.options.getString("equation")!;
      let cleanedMessage = Santinize(message)

      EquationRender(cleanedMessage, interaction)
        
    } catch (error) {
      logger.error(`Equation command failed: ${error}`);
    }
  },
};

export { equationModule as command };