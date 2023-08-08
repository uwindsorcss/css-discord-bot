import {
  inlineCode,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  CacheType,
  TextChannel,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import {CommandType} from "../types";
import {handleEmbedResponse} from "@/helpers";
import {logger} from "@/config";

const promptModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("prompt")
    .setDescription("Ask a question to the community")
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
        .setName("question")
        .setDescription("What is the question?")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const channelID = interaction.options.getChannel(
        "destination"
      ) as TextChannel;

      if (!channelID) {
        return await handleEmbedResponse(interaction, true, {
          message: `Please select a channel to ask the question in ${inlineCode(
            "/prompt"
          )}`,
        });
      }

      const question = interaction.options.getString("question")!;
      const promptMsg = "## :loudspeaker: Community Prompt\n" + question;
      const promptMessage = await channelID.send(promptMsg);

      await promptMessage.startThread({
        name: question,
        autoArchiveDuration: 10080,
      });

      return await handleEmbedResponse(interaction, false, {
        message: `Asked ${inlineCode(question)} in ${channelID}`,
        ephemeral: false,
      });
    } catch (error) {
      logger.error(`Prompt command failed: ${error}`);
    }
  },
};

export {promptModule as command};
