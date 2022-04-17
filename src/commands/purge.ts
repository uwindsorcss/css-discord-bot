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
			let check = await CheckUserRole(interaction.member! as GuildMember)

			if (check) {
				
				const amount = interaction.options.getInteger('n')!;

				logger.debug(`Purge was called with ${amount}`);
				if (!amount || amount < 1 || amount > 99) {
				  await interaction.reply("**ERROR** `n` must be 1 <= n <= 99");
				  return;
				}

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
			}
			else {
				return interaction.reply({
					content: 'You need the admin role to run this command',
					ephemeral
				});
			}
		} catch (err) {
			console.error(err);
		}
	},
};

export { purgeModule as command };
