import {logger} from "@/config";
import {
  CacheType,
  inlineCode,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  TextChannel,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import {CommandType} from "../types";
import {handleEmbedResponse} from "@/helpers";

const sayModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Announce a message in a channel")
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

      return await handleEmbedResponse(interaction, false, {
        message: `I have announced your message in ${inlineCode(
          channelID?.name
        )}.`,
        ephemeral: false,
      });
    } catch (error) {
      logger.error(`Say command failed: ${error}`);
    }
  },
};

export {sayModule as command};
