import { logger } from "../logger";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed } from "discord.js";
import { CommandType } from "../types";
import axios from 'axios';

const gifModule: CommandType = {
    data: new SlashCommandBuilder()
        .setName("gif")
        .setDescription("What gifs would you like to find?")
        .addStringOption((option: SlashCommandStringOption) => {
            option
                .setName("searchterm")
                .setDescription("Whatever 💁:")
                .setRequired(true)

            return option
        }),

    execute: async (interaction: CommandInteraction<CacheType>) => {
        try {
            const searchTerm = interaction.options.getString("searchterm", true);

            const apiKey = 'DFK86ASOY6XU'

            let search_url = `https://g.tenor.com/v1/search?q=${searchTerm}&key=${apiKey}&limit=8`;

            let response = await axios(search_url);

            // let json:any = await response.json();
            //console.log(response.data.results);


            const randomIdx = Math.floor(Math.random() * response.data.results.length);
            // console.log(response.data.results[randomIdx].media[0].gif.url)

            const embed = new MessageEmbed()
                .setImage(response.data.results[randomIdx].media[0].gif.url);

            await interaction.reply({ embeds: [embed] });

            return;

        }
        catch (error) {
            logger.error(`Whereis command failed: ${error}`);
        }
    },

};

export { gifModule as command };
