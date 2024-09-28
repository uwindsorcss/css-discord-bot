import {CommandType} from "../types";
import {logger} from "@/config";

import {
  CacheType,
  SlashCommandBuilder,
  GuildMember,
  ChatInputCommandInteraction,
} from "discord.js";

const notifyModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("notify")
    .setDescription("Get or remove course notifications")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Get a course notification role.")
        .addStringOption((option) =>
          option
            .setName("course")
            .setDescription("Course code: e.g. Comp1000")
            .setMinLength(8)
            .setMaxLength(8)
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a course notification role")
        .addStringOption((option) =>
          option
            .setName("course")
            .setDescription("Course code: e.g. Comp1000")
            .setMinLength(8)
            .setMaxLength(8)
            .setRequired(true)
        )
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const subCommand = interaction.options.getSubcommand();
    const student = interaction.member as GuildMember;
    const courseCode = interaction.options.getString("course");
    let courseSubject = courseCode.slice(0, 4);

    // This variable forces the format to be like *Comp*
    courseSubject =
      courseSubject.charAt(0).toUpperCase() +
      courseSubject.toLowerCase().slice(1);
    const courseNumber = courseCode.slice(4);

    try {
      const courseRole = interaction.guild.roles.cache.find(
        (role) => role.name === `${courseSubject}-${courseNumber}`
      );
      if (subCommand === "add") {
        await student.roles.add(courseRole);
        await interaction.reply({
          content: `You are now notified for **${courseSubject.toUpperCase()}-${courseNumber}** updates.`,
          ephemeral: true,
        });
      } else {
        await student.roles.remove(courseRole);
        await interaction.reply({
          content: `You are no longer notified for **${courseSubject.toUpperCase()}-${courseNumber}** updates.`,
          ephemeral: true,
        });
      }
    } catch (error: any) {
      logger.info(`Invalid Role: ${courseSubject}-${courseNumber}`);
      await interaction.reply({
        content: "Invalid course code!",
        ephemeral: true,
      });
    }
  },
};

export {notifyModule as command};
