import {CommandType} from "../types";
import {logger, Config} from "@/config";

import {
  CacheType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";

// Interfaces for getting specific entries.
interface SearchResult {
  title: string;
  link: string;
}

interface Results {
  items: SearchResult[];
}

const googleModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("google")
    .setDescription("Google something and return the top 10 results.")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("What you want to Google.")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("to")
        .setDescription("The user you want to direct this to.")
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const query = interaction.options.getString("query");
    const toWhom = interaction.options.getUser("to");
    try {
      const embed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setAuthor({
          name: `Requested by ${interaction.user.displayName}`,
          iconURL: `${interaction.user?.avatarURL()}`,
        })
        .setTimestamp();

      if (!Config.google_search_key || !Config.google_search_id) {
        logger.info("No key or search engine ID.");
        return;
      }

      const search_key = Config.google_search_key;
      const search_id = Config.google_search_id;
      const url = `https://www.googleapis.com/customsearch/v1?key=${search_key}&cx=${search_id}&q=${query}`;

      let response: string = "";

      const res = await fetch(url, {
        method: "GET",
        headers: {Accept: "*/*"},
      });

      if (!res.ok) {
        logger.info("No response from Google");
        return interaction.reply({
          content: "Google was unable to return any results.",
          ephemeral: true,
        });
      }

      const data: Results = await res.json();

      if (data.items.length == 0) {
        response = "No results.";
      } else {
        response = data.items
          .map(
            ({title, link}: SearchResult, i: number) =>
              `${i + 1}. [${title}](${link})`
          )
          .join("\n");
      }

      embed.setDescription(`**Query: ${query}**\n${response}`);

      interaction.reply({
        content: toWhom?.toString() ?? "",
        embeds: [embed],
      });
    } catch (error: any) {
      logger.info(error);
    }
  },
};

export {googleModule as command};
