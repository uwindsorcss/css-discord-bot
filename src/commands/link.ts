import {logger, prisma} from "@/config";
import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandStringOption,
  CacheType,
  AutocompleteInteraction,
  inlineCode,
} from "discord.js";
import {CommandType} from "../types";
import {Link} from "@prisma/client";
import {handleEmbedResponse} from "@/helpers";

const linkModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("link")
    .setDescription("Which link would you like to see?")
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
      const res = await prisma.link.findUnique({
        where: {
          name: choice,
        },
      });
      if (res) {
        await interaction.reply({
          content: res.url,
        });
      } else {
        return await handleEmbedResponse(interaction, true, {
          message: `I couldn't find a link with the name ${inlineCode(
            choice
          )}. Please try again.`,
        });
      }
    } catch (error) {
      logger.error(`Link command failed: ${error}`);
    }
  },
  autoComplete: async (interaction: AutocompleteInteraction) => {
    let searchString = interaction.options.getString("link", true) ?? "";
    let res: Link[];
    if (searchString.length == 0) {
      res = await prisma.link.findMany({
        take: 25,
      });
    } else {
      //FilterLinkByName
      res = await prisma.link.findMany({
        where: {
          name: {
            contains: searchString,
          },
        },
        take: 25,
      });
    }
    interaction.respond(
      res.map((link) => ({
        name: link.name,
        value: link.name,
      }))
    );
  },
};

export {linkModule as command};
