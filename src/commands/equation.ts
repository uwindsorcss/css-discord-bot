import {logger} from "@/config";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CacheType,
  ChatInputCommandInteraction,
  ComponentType,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import {CommandType} from "../types";
import {EquationRender, Sanitize} from "../helpers/LatexHelpers";

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
      const cleanedMessage = Sanitize(message);
      const img = await EquationRender(cleanedMessage, interaction);

      const deleteBtn = new ButtonBuilder()
        .setCustomId("delete")
        .setLabel("🗑️")
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        deleteBtn
      );

      const response = await interaction.editReply({
        files: [img],
        components: [row],
      });

      const filter = (i: {user: {id: string}}) =>
        i.user.id === interaction.user.id;

      try {
        const componentInteraction = await response.awaitMessageComponent({
          filter: filter,
          componentType: ComponentType.Button,
          time: 60000,
          dispose: true,
        });

        if (componentInteraction.customId === "delete") await response.delete();
      } catch (e) {
        await interaction.editReply({
          components: [],
        });
      }
    } catch (error) {
      logger.error(`Equation command failed: ${error}`);
    }
  },
};

export {equationModule as command};
