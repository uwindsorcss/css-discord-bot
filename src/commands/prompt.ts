import {
  inlineCode,
  SlashCommandBuilder,
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
    .addStringOption((opt: SlashCommandStringOption) =>
      opt
        .setName("question")
        .setDescription("What is the question?")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    const configChannel = Config?.prompt.channel;
    const channelId = interaction.guild?.channels.cache.find(
      (channel) => channel.id === configChannel
    ) as TextChannel | undefined;

    if (!channelId) {
      await interaction.reply({
        content: `Error: Channel ${inlineCode(
          configChannel!.toString()
        )} does not exist in this guild`,
      });
      return;
    }

    const question = interaction.options.getString("question")!;
    const promptMsg =
      Config?.prompt.top_text +
      "## :loudspeaker: Community Prompt\n" +
      question +
      Config?.prompt.bottom_text;
    const promptMessage = await channelId.send(promptMsg);

    await promptMessage.startThread({
      name: question,
      autoArchiveDuration: 10080,
    });

    const feedbackEmbed = new MessageEmbed()
      .setTitle("Successful :white_check_mark:")
      .setDescription(`Asked ${inlineCode(question)} in <#${configChannel}>`);
    interaction.reply({embeds: [feedbackEmbed], ephemeral: true});
  },
};

export {promptModule as command};
