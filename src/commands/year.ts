import { CommandType } from "../types";
import { logger } from "../logger";
import {
    inlineCode,
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
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
import { year_roles } from "../config";
import { AddUserRole } from "../helpers/userRoles";

const yearModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("year")
        .setDescription("Input year from 1 to 4")
        .addStringOption((option: SlashCommandStringOption) =>
            option
                .setName("year")
                .setDescription("Input year from 1 to 4")
                .setRequired(true)
                // .addChoice('1st year', '1st year')
                // .addChoice('2nd year', '2nd year')
                // .addChoice('3rd year', '3rd year')
                // .addChoice('4th year', '4th year')
                // .addChoice('Masters', 'Masters')
                // .addChoice('Alumni', 'Alumni')
        ),
    execute: async (interaction: CommandInteraction<CacheType>) => {


        try {
            const year = interaction.options.getString("year", true).toLowerCase();

            let role:string = "";

            for (let yearKey in year_roles) {
                if(year === yearKey){
                    role = year_roles[yearKey];
                }
            }
            await AddUserRole(interaction.member as GuildMember, role);

            interaction.reply("Done");
        } catch (err) {
            console.error(err);
        }
    },
};

export { yearModule as command };
