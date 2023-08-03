import {CommandType} from "../types";
import {logger} from "@/config";
import {
  CacheType,
  TextChannel,
  ThreadChannel,
  inlineCode,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  EmbedBuilder,
  ChatInputCommandInteraction,
  Colors,
  PermissionFlagsBits,
} from "discord.js";

const purgeModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purges the last N messages where 1 <= n <= 100")
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
        const embed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle(":x: Error")
          .setDescription("`n` must be 1 <= n <= 99");
        return interaction.reply({embeds: [embed], ephemeral: true});
      }

      const channel = interaction.channel as TextChannel | ThreadChannel;
      const messages = await channel.messages.fetch({limit: amount});
      if (messages.size === 0) {
        const embed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle(":x: Error")
          .setDescription("There are no messages to delete.");
        return interaction.reply({embeds: [embed], ephemeral: true});
      } else if (messages.size < amount) {
        const embed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle(":x: Error")
          .setDescription(
            `There are only ${inlineCode(
              messages.size.toString()
            )} messages in this channel.`
          );
        return interaction.reply({embeds: [embed], ephemeral: true});
      }

      const deleted = await channel.bulkDelete(messages, true);

      const embed = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle(":white_check_mark: Success")
        .setDescription(
          `Deleted ${
            amount === 1 ? "`1` message" : `\`${deleted.size}\` messages`
          }.`
        );

      interaction.reply({embeds: [embed], ephemeral: true});
    } catch (err) {
      console.error(err);
    }
  },
};

export {purgeModule as command};
