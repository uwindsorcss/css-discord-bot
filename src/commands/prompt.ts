import {
  inlineCode,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  CacheType,
  TextChannel,
  MessageEmbed,
} from "discord.js";
import {CommandType} from "../types";
import {Config} from "../config";

const promptModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Ask a question to the community")
    .addChannelOption((option: SlashCommandChannelOption) =>
      option
        .setName("destination")
        .setDescription("Select a channel")
        .setRequired(true)
        .addChannelType(0)
    )
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("question")
        .setDescription("What is the question?")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    const channelID = interaction.options.getChannel(
      "destination"
    ) as TextChannel;

    if (!channelID) {
      const errorEmbed = new MessageEmbed()
        .setTitle("Error :x:")
        .setDescription(
          `Please select a channel to ask the question in ${inlineCode(
            "/prompt"
          )}`
        );
      return interaction.reply({embeds: [errorEmbed], ephemeral: true});
    }

    const question = interaction.options.getString("question")!;
    const promptMsg =
      Config?.prompt.top_text +
      "## :loudspeaker: Community Prompt\n" +
      question +
      Config?.prompt.bottom_text;
    const promptMessage = await channelID.send(promptMsg);

    await promptMessage.startThread({
      name: question,
      autoArchiveDuration: 10080,
    });

    const feedbackEmbed = new MessageEmbed()
      .setTitle("Successful :white_check_mark:")
      .setDescription(`Asked ${inlineCode(question)} in ${channelID}`);
    interaction.reply({embeds: [feedbackEmbed], ephemeral: true});
  },
};

export {promptModule as command};
