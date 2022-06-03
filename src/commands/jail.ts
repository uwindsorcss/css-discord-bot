import { CommandType } from "../types";
import { logger } from "../logger";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, UserResolvable } from "discord.js";

const jailModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("jail")
        .setDescription("Who to put in the jail?")
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to put in jail')
                .setRequired(true)
        ),
    execute: async (interaction: CommandInteraction<CacheType>) => {
        try {
            const member = interaction.options.getUser("user") as UserResolvable;

            let memberDisplayName = (await interaction.guild?.members.fetch(member))?.displayName;

            if (!memberDisplayName) {
                return interaction.reply({
                    content: 'Cannot put this member in jail. Not sure why',
                    ephemeral: true
                });
            }
            let line = "-".repeat(12 + memberDisplayName?.length);

            let resp = "```\n" + line + "\n"
            resp += "|||   " + memberDisplayName + "   |||\n"

            resp += line + "\n```"

            await interaction.reply(resp);

        } catch (error) {
            logger.error(`Jail command failed: ${error}`);
        }

    },
};


export { jailModule as command };
