import {logger, prisma} from "@/config";
import {
  inlineCode,
  SlashCommandBuilder,
  SlashCommandStringOption,
  CacheType,
  AutocompleteInteraction,
  EmbedBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionFlagsBits,
  Colors,
} from "discord.js";
import {CommandType} from "../types";
import {Link} from "@prisma/client";

const linkAdminModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("link-admin")
    .setDescription("Which link?")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Add a new link")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("What is the name of the link?")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("What's this link for?")
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
        const name = interaction.options.getString("name", true);
        const description = interaction.options.getString("description", true);
        const URL = interaction.options.getString("url", true);

        //check if the link already exists in the database
        const link = await prisma.link.findUnique({
          where: {
            name: name,
          },
        });

        // check if the link already exists
        if (link !== null) {
          return await interaction.reply({
            content: `Sorry but ${inlineCode(
              name
            )} already exists, please try another name.`,
          });
        }

        //URL validation
        const urlRegex = new RegExp(
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
        );
        if (!urlRegex.test(URL)) {
          return await interaction.reply({
            content: `Sorry but ${inlineCode(
              URL
            )} is not a valid url, please try again.`,
          });
        }

        //create the link
        const createdLink = await prisma.link.create({
          data: {
            name: name,
            description: description,
            url: URL,
            userID: interaction.user.id,
            userName: interaction.user.username,
            displayName: interaction.user.displayName,
          },
        });

        //check if the link was created
        if (createdLink === undefined) {
          await interaction.reply({
            content: `Sorry but something went wrong when I tried creating a new link`,
          });
          return;
        }

        //send the response
        await interaction.reply({
          content: `Complete creating ${inlineCode(createdLink!.name)}`,
        });
      } else if (subcommand === "delete") {
        const searchString = interaction.options.getString("link", true);

        //create the action row
        const row =
          new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
            new StringSelectMenuBuilder()
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
                }
              )
          );

        //Get the link
        const link = await prisma.link.findUnique({
          where: {
            name: searchString,
          },
        });

        //check if the link exists
        if (link === undefined || link === null) {
          await interaction.reply({
            content:
              "Sorry but I couldn't find that link, please try again later.",
          });
          return;
        }

        //Ask for confirmation
        const embed = new EmbedBuilder()
          .setColor(Colors.Aqua)
          .setTitle(link.name)
          .setDescription(link.url);
        await interaction.reply({
          content: `Do you want to delete ${inlineCode(link?.name)} (${
            link.url
          })?`,
          components: [row],
          embeds: [embed],
        });
      }
    } catch (error) {
      logger.error(`Link command failed: ${error}`);
    }
  },
  autoComplete: async (interaction: AutocompleteInteraction) => {
    const subcommand = interaction.options.getSubcommand();
    const searchString = interaction.options.getString("link", true) ?? "";
    let res: Link[];
    if (searchString.length == 0) {
      res = await prisma.link.findMany();
    } else {
      res = await prisma.link.findMany({
        where: {
          name: {
            contains: searchString,
          },
        },
      });
    }
    if (subcommand === "delete") {
      interaction.respond(
        res.map((link) => ({
          name: link.name,
          value: link.name,
        }))
      );
    }
  },
};

export {linkAdminModule as command};
