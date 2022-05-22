import { CommandType } from "../types";
import {
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "@discordjs/builders";
import {
    CommandInteraction,
    CacheType} from "discord.js";
import { logger } from "../logger";

const yearModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("year")
        .setDescription("Input year from 1 to 4")
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName("year")
                .setDescription("Input year from 1 to 4")
                .setRequired(true)
        ),
    execute: async (interaction: CommandInteraction<CacheType>) => {
        try {
            interaction.reply("Not supported");
        } catch (err) {
            logger.error({err})
        }
    },
};

export { yearModule as command };
