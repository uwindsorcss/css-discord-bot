import {CommandType} from "../types";
import {logger} from "../logger";
import {
  SlashCommandBuilder,
  SlashCommandIntegerOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  CacheType,
  TextChannel,
  ThreadChannel,
} from "discord.js";

const purgeModule: CommandType = {
  allowGlobal: false,
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purges the last N messages where 1 <= n <= 99")
    .addIntegerOption((option: SlashCommandIntegerOption) =>
      option
        .setName("n")
        .setDescription("Number of messages to purge")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    let n = interaction.options.getInteger("n");
    logger.debug(`Purge was called with ${n}`);
    if (!n || n < 1 || n > 99) {
      await interaction.reply("**ERROR** `n` must be 1 <= n <= 99");
      return;
    }

    // if no guild then in DM
    // NOTE: this should never actually be true, as long as allowGlobal = false
    if (!interaction.guild) {
      await interaction.reply("**ERROR:** command only works in servers");
      return;
    }

    // cast channel to either TextChannel or ThreadChannel
    const channel = interaction.channel as TextChannel | ThreadChannel;

    // bulk delete (n + 1) number of messages
    await interaction.reply(`Purging ${n} messages...`);
    await channel?.bulkDelete(n + 1);
  },
};

export {purgeModule as command};
