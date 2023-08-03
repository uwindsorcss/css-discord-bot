import {logger} from "@/config";
import {
  CacheType,
  inlineCode,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  EmbedBuilder,
  TextChannel,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import {CommandType} from "../types";

const sayModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Say something?")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((option: SlashCommandChannelOption) =>
      option
        .setName("destination")
        .setDescription("Select a channel")
        .setRequired(true)
        .addChannelTypes(0)
    )
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("message")
        .setDescription("The text that you would like to announce")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const channelID = interaction.options.getChannel(
        "destination"
      ) as TextChannel;

      const message = interaction.options.getString("message")!;
      channelID?.send({content: message});

      const embed = new EmbedBuilder()
        .setTitle("Successfully Say Messages")
        .setDescription(
          `Successfully say ${inlineCode(message)} in ${inlineCode(
            channelID.name
          )}!`
        );

      interaction.reply({embeds: [embed], ephemeral: true});
    } catch (error) {
      logger.error(`Say command failed: ${error}`);
    }
  },
};

export {sayModule as command};
