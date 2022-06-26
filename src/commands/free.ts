import { CommandType } from "../types";
import { logger } from "../logger";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, UserResolvable } from "discord.js";


const freeModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("free")
        .setDescription("Free them all !!!")
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to free')
                .setRequired(true)
        ),
    execute: async (interaction: CommandInteraction<CacheType>) => {
        try {
            const member = interaction.options.getUser("user") as UserResolvable;

            let memberDisplayName = (await interaction.guild?.members.fetch(member))?.displayName;

            if (!memberDisplayName) {
                return interaction.reply({
                    content: 'Cannot let this member out of jail',
                    ephemeral: true
                });
            }
            let line = "-".repeat(12 + memberDisplayName?.length);

            let resp = "```\n" + line + "\n"
            resp += "|||   " + memberDisplayName + "\n"


            resp += line + "\n```"

            await interaction.reply(resp);

        } catch (error) {
            logger.error(`Free command failed: ${error}`);
        }

    },
};

export { freeModule as command }
