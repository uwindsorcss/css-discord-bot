import {logger} from "@/config";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  CacheType,
  AutocompleteInteraction,
} from "discord.js";
import {CommandType} from "../types";
import {
  FilterLinkByName,
  FindLinkByName,
  GetAllLinks,
  Link,
} from "../helpers/linkQueries";

const linkModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Which link do you want to send")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("link")
        .setDescription("Select a link")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const choice = interaction.options.getString("link", true);
      let res = FindLinkByName(choice);
      if (res) {
        await interaction.reply({
          content: res.url,
        });
      } else {
        await interaction.reply({
          content: `Cannot find any link match with your request.`,
        });
      }
    } catch (error) {
      logger.error(`Link command failed: ${error}`);
    }
  },
  autoComplete: async (interaction: AutocompleteInteraction) => {
    let searchString = interaction.options.getString("link", true) ?? "";
    let res: Link[] = [];
    if (searchString.length == 0) {
      res = await GetAllLinks();
    } else {
      res = FilterLinkByName(searchString);
    }
    interaction.respond(
      res.map((link) => ({
        name: link.shorten_link,
        value: link.shorten_link,
      }))
    );
  },
};

export {linkModule as command};
