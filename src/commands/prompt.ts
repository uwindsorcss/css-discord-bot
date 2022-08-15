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

    let channelId = interaction.guild?.channels.cache.find(channel => channel.name === Config?.prompt.channel) as TextChannel

    let question = interaction.options.getString("question")!;

    let promptMess = Config?.prompt.top_text + question + Config?.prompt.bottom_text

    channelId?.send({ content: promptMess });

    const embed = new MessageEmbed()
      .setTitle("Successfully Ask Question")
      .setDescription(
        `Successfully ask ${inlineCode(question)} in ${inlineCode(
          channelId.name
        )}!`
      );

    const ephemeral = true;
    interaction.reply({ embeds: [embed], ephemeral });
  },
};

export { promptModule as command };
