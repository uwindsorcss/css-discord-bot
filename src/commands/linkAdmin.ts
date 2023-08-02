import {logger} from "@/config";
import {
  inlineCode,
  SlashCommandBuilder,
  SlashCommandStringOption,
  CacheType,
  AutocompleteInteraction,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import {CommandType} from "../types";
import {Link} from "../helpers/linkQueries";
import {
  CreateNewLink,
  FilterLinkByName,
  FindLinkByName,
  GetAllLinks,
} from "../helpers/linkQueries";

const linkAdminModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("link-admin")
    .setDescription("Which link?")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Add a new link")
        .addStringOption((option) =>
          option
            .setName("shorten_link")
            .setDescription("What is the name of the link?")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("url")
            .setDescription("What is the url of the link?")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a link")
        .addStringOption((option: SlashCommandStringOption) =>
          option
            .setName("link")
            .setDescription("Select a link to delete")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      if (!interaction.isCommand()) return;
      const subcommand = interaction.options.getSubcommand();
      if (subcommand === "create") {
        let shorten_link = interaction.options.getString("shorten_link", true);
        let url = interaction.options.getString("url", true);
        let createdLink = await CreateNewLink(shorten_link, url);
        if (createdLink === undefined) {
          await interaction.reply({
            content: `Sorry but something went wrong when I tried creating a new link`,
          });
          return;
        }
        await interaction.reply({
          content: `Complete creating ${inlineCode(createdLink!.shorten_link)}`,
        });
      } else if (subcommand === "delete") {
        let searchString = interaction.options.getString("link", true);
        // const row = new MessageActionRow().addComponents(
        //   new MessageSelectMenu()
        //     .setCustomId("delete-confirmation")
        //     .setPlaceholder("Nothing selected")
        //     .addOptions(
        //       {
        //         label: "Yes",
        //         value: `${searchString}`,
        //       },
        //       {
        //         label: "No",
        //         value: "No",
        //       }
        //     )
        // );

        let link = FindLinkByName(searchString);
        if (link === undefined) {
          await interaction.reply({
            content:
              "Hey boss, it's either your link does not exist or you are teasing me :/",
          });
          return;
        }
        const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(link?.shorten_link)
          .setDescription(link.url);
        await interaction.reply({
          content: `Do you want to delete ${inlineCode(link?.shorten_link)} (${
            link.url
          })?`,
          // components: [row],
          embeds: [embed],
        });
      }
      //what about 'update'?
    } catch (error) {
      logger.error(`Link command failed: ${error}`);
    }
  },
  autoComplete: async (interaction: AutocompleteInteraction) => {
    const subcommand = interaction.options.getSubcommand();
    let searchString = interaction.options.getString("link", true) ?? "";
    let res: Link[];
    if (searchString.length == 0) {
      res = await GetAllLinks();
    } else {
      res = FilterLinkByName(searchString);
    }
    if (subcommand === "create") {
      interaction.respond(
        res.map((link) => ({
          name: link.shorten_link,
          value: link.url,
        }))
      );
    } else if (subcommand === "delete") {
      interaction.respond(
        res.map((link) => ({
          name: link.shorten_link,
          value: link.shorten_link,
        }))
      );
    }
  },
};

export {linkAdminModule as command};
