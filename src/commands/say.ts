import {logger} from "../logger";
import {
  inlineCode,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  CacheType,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import {CommandType} from "../types";

const sayModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Say something?")
    .addChannelOption((option: SlashCommandChannelOption) =>
      option
        .setName("destination")
        .setDescription("Select a channel")
        .setRequired(true)
        .addChannelType(0)
    )
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("message")
        .setDescription("The text that you would like to announce")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      const channelID = interaction.options.getChannel(
        "destination"
      ) as TextChannel;

      const message = interaction.options.getString("message")!;
      channelID?.send({content: message});

      const embed = new MessageEmbed()
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
