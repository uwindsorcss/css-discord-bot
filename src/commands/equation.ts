import {logger} from "@/config";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {CacheType, ChatInputCommandInteraction} from "discord.js";
import {CommandType} from "../types";
import {EquationRender, Santinize} from "../helpers/LatexHelpers";

const equationModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("equation")
    .setDescription("Render a LaTeX equation")
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("equation")
        .setDescription("The equation to render")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const message = interaction.options.getString("equation")!;
      const cleanedMessage = Santinize(message);
      const img = await EquationRender(cleanedMessage, interaction);
      return await interaction.editReply({files: [img]});
    } catch (error) {
      logger.error(`Equation command failed: ${error}`);
    }
  },
};

export {equationModule as command};
