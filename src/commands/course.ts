import {prisma} from "@/config";
import {
  type CacheType,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  SlashCommandStringOption,
  AutocompleteInteraction,
} from "discord.js";
import {handleEmbedResponse} from "@/helpers";
import type {Course} from "@prisma/client";

const courseModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("course")
    .setDescription("Get information about a course.")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("code")
        .setDescription("The course code to get information about.")
        .setRequired(true)
        .setMaxLength(8)
        .setMinLength(8)
        .setAutocomplete(true)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const code: string = interaction.options.getString("code", true);

    const courseCodeRegex = /^[a-zA-Z]{4}[0-9]{4}$/;
    if (!courseCodeRegex.test(code) || code.length !== 8) {
      return await handleEmbedResponse(interaction, true, {
        message: "Course code should be in the format of ABCD1234.",
      });
    }

    const course = await prisma.course.findFirst({
      where: {
        code: code.toLowerCase(),
      },
      include: {
        prerequisites: true,
        antirequisites: true,
        corequisites: true,
      },
    });

    if (!course || course === null) {
      return await handleEmbedResponse(interaction, true, {
        message: "Course not found, please try another code.",
      });
    }

    let embed = {
      title: `${course.code.toUpperCase()} - ${course.name}`,
      description: `**Description:** ${course.description}`,
      color: 0x0099ff,
    };

    if (course.lectureHours !== null) {
      embed.description += `\n\n**Lecture Hours:** ${course.lectureHours}`;
    }

    if (course.labHours !== null) {
      embed.description += `\n**Lab Hours:** ${course.labHours}`;
    }

    if (course.notes) {
      embed.description += `\n**Notes:** ${course.notes}`;
    }

    if (course.prerequisites.length > 0) {
      embed.description += `\n**Prerequisites:** ${course.prerequisites
        .map((prerequisite) => prerequisite.requirement)
        .join(", ")}`;
    }

    if (course.corequisites.length > 0) {
      embed.description += `\n**Corequisites:** ${course.corequisites
        .map((corequisite) => corequisite.requirement)
        .join(", ")}`;
    }

    if (course.antirequisites.length > 0) {
      embed.description += `\n**Antirequisites:** ${course.antirequisites
        .map((antirequisite) => antirequisite.requirement)
        .join(", ")}`;
    }

    await interaction.reply({
      embeds: [embed],
    });
  },
  autoComplete: async (interaction: AutocompleteInteraction) => {
    let searchString = interaction.options
      .getString("code", true)
      .toLowerCase();
    let res: Course[];
    if (searchString.length == 0) {
      res = await prisma.course.findMany({
        take: 25,
      });
    } else {
      res = await prisma.course.findMany({
        where: {
          code: {
            contains: searchString,
          },
        },
        take: 25,
      });
    }
    interaction.respond(
      res.map((course) => ({
        name: course.code.toUpperCase(),
        value: course.code,
      }))
    );
  },
};

export {courseModule as command};
