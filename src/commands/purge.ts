import { CommandType } from "../types";
import { logger } from "../logger";
import {
	inlineCode,
	SlashCommandBuilder,
	SlashCommandIntegerOption,
} from "@discordjs/builders";
import {
	CommandInteraction,
	CacheType,
	TextChannel,
	ThreadChannel,
	Permissions,
	Message,
	Collection,
	MessageEmbed,
	GuildMember
} from "discord.js";
import { CheckUserRole } from "../helpers/userRoles";

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
    const channel = interaction.channel as TextChannel | ThreadChannel;
		const deleted = await channel.bulkDelete(amount);

		const embed = new MessageEmbed()
			.setColor('DARK_GREEN')
			.setAuthor({
				name: interaction.user.tag,
				iconURL: interaction.user.displayAvatarURL({ dynamic: true })
			})
			.setTitle('Successfully Deleted Messages')
			.setDescription(`Successfully deleted ${inlineCode(deleted.size.toString())} messages!`)
			.setTimestamp()
			.setFooter({ text: `Version 9` });

		interaction.reply({ embeds: [embed], ephemeral });
  },

};

export { purgeModule as command };
