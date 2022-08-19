import { logger } from "../logger";
import {
    SlashCommandBuilder,
    SlashCommandStringOption,
} from "@discordjs/builders";
import { CommandInteraction, CacheType, AutocompleteInteraction } from "discord.js";
import { CommandType } from "../types";
import { Link } from "../schemas/link";
import { FindLinkByName, GetAllShortenLinks } from "../helpers/linkQueries";

const linkModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("link")
        .setDescription("Which link do you want to send")
        .addStringOption((option: SlashCommandStringOption) => {
            option
                .setName("link")
                .setDescription("Choose Link")
                .setRequired(true)
                .setAutocomplete(true);
                
                
            return option;
        }),
    execute: async (interaction: CommandInteraction<CacheType>) => {
        try {
            const choice = interaction.options.getString("link", true);

            await interaction.reply({
                content: `Your request for ${choice}`
            })
            
        } catch (error) {
            logger.error(`Link command failed: ${error}`);
        }
    },
    autoComplete: async (interaction: AutocompleteInteraction) => {
        let searchString = interaction.options.getString("link", true) ?? "";

        let res: Link[];
        if(searchString.length == 0){
            res = await GetAllShortenLinks()
        } else {
            res = FindLinkByName(searchString)
        }
        
        interaction.respond(res.map(link => ({
            name: link.name,
            value: `${link.name}: ${link.url}`
        })))
    }
};

export { linkModule as command };