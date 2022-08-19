import { logger } from "../logger";
import {
  inlineCode,
  SlashCommandBuilder,
  SlashCommandStringOption,
  SlashCommandSubcommandBuilder,
} from "@discordjs/builders";
import { CommandInteraction, CacheType, AutocompleteInteraction, MessageActionRow, MessageSelectMenu } from "discord.js";
import { CommandType } from "../types";
import fs from "fs";
import { Link, linkModel } from "../schemas/link";
import path from "path";
import { CreateNewLink, FindLinkByName, GetAllShortenLinks } from "../helpers/linkQueries";


const linkAdminModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("link-admin")
    .setDescription("Which link?")
    .addSubcommand(subcommand =>
      subcommand
        .setName("create")
        .setDescription("Add new link?")
        .addStringOption(option =>
          option
            .setName("shorten_link")
            .setDescription("What is the name of the link?")
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName("url")
            .setDescription("What is the url of the link?")
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("delete")
        .setDescription("delete link?")
        .addStringOption((option: SlashCommandStringOption) => {
          option
            .setName("link")
            .setDescription("Choose Link")
            .setRequired(true)
            .setAutocomplete(true);

          return option;
        })
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      if (!interaction.isCommand()) return;

      const subcommand = interaction.options.getSubcommand()

      if (subcommand === "create") {
        let shorten_link = interaction.options.getString("shorten_link", true)

        let url = interaction.options.getString("url", true)

        await CreateNewLink(shorten_link, url)

        await interaction.reply({
          content: `Complete creating ${inlineCode(shorten_link)}`
        })
      } else if (subcommand === "delete") {

        let searchString = interaction.options.getString("link", true) ?? "";

        const row = new MessageActionRow()
          .addComponents(
            new MessageSelectMenu()
              .setCustomId("delete-confirmation")
              .setPlaceholder("Nothing selected")
              .addOptions(
                {
                  label: "Yes",
                  value: `${searchString}`,
                },
                {
                  label: "No",
                  value: "No",
                },
              ),
          );

        let link = await linkModel.findById(searchString)
        if (link) {
          await interaction.reply({ content: `Do you want to delete ${inlineCode(link?.name)} (${link.url})?`, components: [row] })
        }
      }
      //what about 'update'?
    } catch (error) {
      logger.error(`Link command failed: ${error}`);
    }
  },
  autoComplete: async (interaction: AutocompleteInteraction) => {
    const subcommand = interaction.options.getSubcommand()
    let searchString = interaction.options.getString("link", true) ?? "";

    let res: Link[];
    if (searchString.length == 0) {
      res = await GetAllShortenLinks()
    } else {
      res = FindLinkByName(searchString)
    }


    if (subcommand === "create") {
      interaction.respond(res.map(link => ({
        name: link.name,
        value: link.url
      })))
    } else if (subcommand === "delete") {
      interaction.respond(res.map(link => ({
        name: link.name,
        value: link._id.toString()
      })))
    }




  }
};

export { linkAdminModule as command };
