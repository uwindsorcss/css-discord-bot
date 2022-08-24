import { logger } from "../logger";
import { inlineCode, SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, TextChannel, MessageEmbed } from "discord.js";
import { CommandType } from "../types";
import { Config } from "../config";

const promptModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Ask something?")
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("question")
        .setDescription("What is the question?")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {

    let configChannel = Config?.prompt.channel
    let channelId = interaction.guild?.channels.cache.find(channel => channel.name === configChannel) as TextChannel

    if (channelId === undefined) {
      await interaction.reply({ content: `Channel ${inlineCode(configChannel!.toString())} does not exist in this guild` })
      return;
    }
    let question = interaction.options.getString("question")!;

    let promptMess = Config?.prompt.top_text + question + Config?.prompt.bottom_text

    channelId?.send({ content: promptMess });

    const embed = new MessageEmbed()
      .setTitle("Successfully asked Question")
      .setDescription(
        `Successfully ask ${inlineCode(question)} in ${inlineCode(
          channelId.name
        )}!`
      );
    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

export { promptModule as command };
