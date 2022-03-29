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
  MessageEmbed
} from "discord.js";

const purgeModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Purges the last N messages where 1 <= n <= 100")
    .addIntegerOption((option: SlashCommandIntegerOption) =>
      option
        .setName("n")
        .setDescription("Number of messages to purge")
        .setRequired(true)
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {

    const ephemeral = true;

		try {
			if (!interaction.memberPermissions!.has(['MANAGE_MESSAGES'])) {
				return interaction.reply({
					content: 'You need the manage messages permission to run this command',
					ephemeral
				});
			}
			if (!interaction.guild!.me!.permissions.has(['MANAGE_MESSAGES'])) {
				return interaction.reply({
					content: 'I need the manage messages permission to run this command',
					ephemeral
				});
			}

			const amount = interaction.options.getInteger('n')!;

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
		} catch (err) {
			console.error(err);
		}
  },
};

export { purgeModule as command };
