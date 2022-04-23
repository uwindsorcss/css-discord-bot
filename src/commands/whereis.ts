import { logger } from "../logger";
import { SlashCommandBuilder, SlashCommandStringOption } from "@discordjs/builders";
import { CommandInteraction, CacheType, MessageEmbed } from "discord.js";
import { CommandType } from "../types";
import { FindBuildingByCode, FindBuildingByName, ListAllBuildings } from "../helpers/buildings";
import { IMAGE_DIRECTORY_URL } from "../config";


const whereIsModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("whereis")
    .setDescription("Where do u wanna go?")
    .addStringOption((option: SlashCommandStringOption) => {
      option
        .setName("building")
        .setDescription("Choose building")
        .setRequired(true)

      return option
    }),

  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      //get "args" from option
      const args = interaction.options.getString("building", true);

      if (args === "list") {
        let buildingList = ListAllBuildings();
        const embed = new MessageEmbed()
          .setTitle("Building List")
          .addFields(
            { name: "Code", value: buildingList.codes, inline: true },
            { name: "Full Names", value: buildingList.names, inline: true }
          );

        await interaction.reply({ embeds: [embed] });

        return;
      }
      else {
        let buildingCode = args.toUpperCase();

        // Check if the "args" string is a building's code 
        let buildingFound = FindBuildingByCode(buildingCode);

        if (buildingFound.length !== 0) {
          const embed = new MessageEmbed()
            .setTitle("Building Search")
            .setDescription(`${buildingFound} (#${buildingCode}) `)
            .setImage(`${IMAGE_DIRECTORY_URL}/${buildingCode}.png`);

          await interaction.reply({ embeds: [embed] });

          return;
        }
        else {
          // If the argument matches a building name
          let resArr = FindBuildingByName(args);
          if (resArr.length > 0) {
            let bestRes = resArr[0];

            const embed = new MessageEmbed()
              .setTitle("Building Search")
              .setDescription(`${bestRes.item.name} (${bestRes.item.code}) `)
              .setImage(`${IMAGE_DIRECTORY_URL}/${bestRes.item.code}.png`);

            await interaction.reply({ embeds: [embed] });

            return;
          }
          else {
            return interaction.reply({
              content: "Building or command could not be found.",
            });
          }

        }
      }
    } 
    catch (error) {
      logger.error(`Whereis command failed: ${error}`);
    }
  },

};

export { whereIsModule as command };
