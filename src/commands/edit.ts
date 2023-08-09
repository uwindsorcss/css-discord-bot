import {CommandType} from "../types";
import {logger} from "@/config";
import {handleEmbedResponse} from "@/helpers";
import {
  CacheType,
  ChatInputCommandInteraction,
  MessageType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

const editModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("edit")
    .setDescription(
      "Edit a message sent by the bot using the say or promote command"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addStringOption((option) => {
      option
        .setName("message-link")
        .setDescription("The link the message to edit")
        .setRequired(true);
      return option;
    })
    .addStringOption((option) => {
      option
        .setName("new-message")
        .setDescription("The new message to replace the old one")
        .setRequired(true);
      return option;
    }),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const messageLink = interaction.options.getString("message-link", true);
      let newMessage = interaction.options
        .getString("new-message", true)
        .replaceAll("\\n", "\n");

      const messageLinkRegex =
        /https:\/\/discord.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
      const messageLinkMatch = messageLink.match(messageLinkRegex);

      if (!messageLinkMatch) {
        return await handleEmbedResponse(interaction, true, {
          message: `Invalid message link, please try again`,
          ephemeral: true,
        });
      }

      const [link, guild, channel, messageID] = messageLinkMatch;

      const channelToEdit: TextChannel | undefined =
        interaction.guild?.channels.cache.get(channel) as TextChannel;

      if (!channelToEdit) {
        return await handleEmbedResponse(interaction, true, {
          message: `Channel not found, please try again.`,
          ephemeral: true,
        });
      }

      const messageToEdit = await channelToEdit.messages
        .fetch(messageID)
        .then((message) => message)
        .catch(() => null);

      if (!messageToEdit) {
        return await handleEmbedResponse(interaction, true, {
          message: `Message not found, please try again.`,
          ephemeral: true,
        });
      }

      if (messageToEdit.author.id !== interaction.client.user?.id) {
        return await handleEmbedResponse(interaction, true, {
          message: `You can only edit messages sent by me.`,
          ephemeral: true,
        });
      }

      if (messageToEdit.type === MessageType.ChatInputCommand) {
        return await handleEmbedResponse(interaction, true, {
          message: `You can't edit command responses.`,
          ephemeral: true,
        });
      }

      if (
        messageToEdit.embeds.length > 0 ||
        messageToEdit.attachments.size > 0
      ) {
        return await handleEmbedResponse(interaction, true, {
          message: `You can only edit messages with text.`,
          ephemeral: true,
        });
      }

      const oldMessage = messageToEdit.content;

      //check if message is a community prompt
      if (oldMessage.split("\n")[0].toLowerCase().includes("community prompt"))
        newMessage = `${oldMessage.split("\n")[0]}\n${newMessage}`;

      await messageToEdit.edit(newMessage);

      return await handleEmbedResponse(interaction, false, {
        message: `I have edited the message from 

        ${oldMessage}

        to

        ${newMessage}`,
        ephemeral: false,
      });
    } catch (error) {
      logger.error(`Edit command failed: ${error}`);
    }
  },
};

export {editModule as command};
