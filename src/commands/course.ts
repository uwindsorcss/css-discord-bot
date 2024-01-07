import {logger} from "@/config";
import {
  CacheType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandStringOption,
} from "discord.js";
import {CommandType} from "../types";
import {handleEmbedResponse} from "@/helpers";

interface CourseDetails {
  Prerequisites: string[];
  Corequisites: string[];
  Antirequisites: string[];

  LabHours: number;
  LectureHours: number;

  Code: string;
  Name: string;
  Description: string;

  Notes: string;
}

const courseModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("course")
    .setDescription("Get informtion about a course.")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("details")
        .setDescription("Get information about a course.")
        .addStringOption((option: SlashCommandStringOption) =>
          option
            .setName("code")
            .setDescription("The course code to get information about.")
            .setRequired(true)
            .setMaxLength(8)
            .setMinLength(8)
        )
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {

    // default will never be used because of setRequired(true)
    const code: string = interaction.options.getString("code")?.toUpperCase() || "default";

    if(/[A-Z]{4}[0-9]{4}/.test(code) === false) {
      return await handleEmbedResponse(interaction, true, {
        message: "Course code should be in the format of ABCD1234."
      })
    }

    const endpoint = "https://boratto.ca/winzard/api/details?search=" + code;
    const fetched = await fetch(endpoint);
    if(!fetched.ok) {
      logger.error(`Failed to fetch course details: ${fetched.status} ${fetched.statusText}`)
      return await handleEmbedResponse(interaction, true, {
        message: "Failed to fetch course details."
      })
    }
    const details = await fetched.json() as CourseDetails[];

    for(const detail of details) {
      if(detail.Code === code) {
        await interaction.reply(`
**${code}: ${detail.Name.trim()}**
> ${detail.Description.trim()}
        `)
        return;
      }
    }
    await handleEmbedResponse(interaction, true, {
      message: "Course not found."
    })
    return;
  }
}

export {courseModule as command}
