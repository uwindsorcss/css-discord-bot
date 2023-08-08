import {CommandType} from "../types";
import {logger} from "@/config";
import {handleEmbedResponse} from "@/helpers";
import {
  CacheType,
  TextChannel,
  ThreadChannel,
  inlineCode,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";

const purgeModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purges the last N messages where 1 <= n <= 99")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option: SlashCommandIntegerOption) =>
      option
        .setName("n")
        .setDescription("Number of messages to purge")
        .setRequired(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const amount = interaction.options.getInteger("n");
      logger.debug(`Purge was called with ${amount}`);
      if (!amount || amount < 1 || amount > 99) {
        return await handleEmbedResponse(interaction, true, {
          message: "`n` must be 1 <= n <= 99",
        });
      }

      const channel = interaction.channel as TextChannel | ThreadChannel;
      const messages = await channel.messages.fetch({limit: amount});
      if (messages.size === 0) {
        return await handleEmbedResponse(interaction, true, {
          message: "There are no messages to delete.",
        });
      } else if (messages.size < amount) {
        return await handleEmbedResponse(interaction, true, {
          message: `There are only ${inlineCode(
            messages.size.toString()
          )} messages in this channel.`,
        });
      }

      const deleted = await channel.bulkDelete(messages, true);

      return await handleEmbedResponse(interaction, false, {
        message: `Deleted ${
          amount === 1 ? "`1` message" : `\`${deleted.size}\` messages`
        }.`,
      });
    } catch (err) {
      console.error(err);
    }
  },
};

export {purgeModule as command};
