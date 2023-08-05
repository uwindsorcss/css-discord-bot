import {IMAGE_DIRECTORY_URL, logger} from "@/config";
import Fuse from "fuse.js";
import {
  CacheType,
  SlashCommandBuilder,
  SlashCommandStringOption,
  EmbedBuilder,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from "discord.js";
import {CommandType} from "../types";
import {
  FindBuildingByCode,
  FindBuildingByName,
  ListAllBuildings,
  buildings,
  fuseOptions,
} from "../helpers/buildings";

const whereIsModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("whereis")
    .setDescription("Show the location of a building on campus")
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all buildings")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for a building")
        .addStringOption((opt: SlashCommandStringOption) =>
          opt
            .setName("building")
            .setDescription("Building name or code")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  autoComplete: async (interaction: AutocompleteInteraction) => {
    const argValue = interaction.options.getString("building", true);
    const fuse = new Fuse(buildings, fuseOptions);
    let filtered = buildings.map((building) => building.name);

    // Limit the number of results to 25 to prevent Discord API errors
    if (filtered.length > 25) filtered = filtered.slice(0, 25);

    if (argValue.length > 0)
      filtered = fuse.search(argValue).map((result) => result.item.name);

    await interaction.respond(
      filtered.map((choice) => ({name: choice, value: choice}))
    );
  },
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "list") {
        const buildingsList = ListAllBuildings();
        const embed = new EmbedBuilder()
          .setTitle("Building List")
          .addFields(
            {name: "Code", value: buildingsList.codes, inline: true},
            {name: "Full Names", value: buildingsList.names, inline: true}
          );

        return await interaction.reply({embeds: [embed]});
      } else if (subcommand === "search") {
        const args = interaction.options.getString("building", true);
        const buildingCode = args.toUpperCase();

        // Check if the "args" string is a building's code
        const buildingFound = FindBuildingByCode(buildingCode);

        if (buildingFound.length !== 0) {
          const embed = new EmbedBuilder()
            .setTitle("Building Search")
            .setDescription(`${buildingFound} (#${buildingCode}) `)
            .setImage(`${IMAGE_DIRECTORY_URL}/${buildingCode}.png`);

          return await interaction.reply({embeds: [embed]});
        } else {
          // If the argument matches a building name
          let resArr = FindBuildingByName(args);
          if (resArr.length > 0) {
            let bestRes = resArr[0];

            const embed = new EmbedBuilder()
              .setTitle("Building Search")
              .setDescription(`${bestRes.item.name} (${bestRes.item.code}) `)
              .setImage(`${IMAGE_DIRECTORY_URL}/${bestRes.item.code}.png`);

            return await interaction.reply({embeds: [embed]});
          } else {
            return interaction.reply({
              content: "Building could not be found.",
            });
          }
        }
      } else {
        return interaction.reply({
          content: "Invalid subcommand.",
        });
      }
    } catch (error) {
      logger.error(`Whereis command failed: ${error}`);
    }
  },
};

export {whereIsModule as command};
