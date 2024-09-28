import { logger } from "@/config";

import {
  CacheType,
  SlashCommandBuilder,
  GuildMember,
  ChatInputCommandInteraction,
  Role,
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
    if (!interaction.member || !(interaction.member instanceof GuildMember)) {
      return;
    }

    const subCommand = interaction.options.getSubcommand();
    const student = interaction.member as GuildMember;
    const courseCode = interaction.options.getString("course");

    if (!courseCode) {
      await interaction.reply({
        content: "Course code is missing.",
        ephemeral: true,
      });
      return;
    }

    let courseSubject = courseCode.slice(0, 4);
    courseSubject =
      courseSubject.charAt(0).toUpperCase() +
      courseSubject.toLowerCase().slice(1);
    const courseNumber = courseCode.slice(4);

    try {
      if (!interaction.guild) {
        throw new Error("Guild not found.");
      }

      const courseRole: Role | undefined = interaction.guild.roles.cache.find(
        (role) => role.name === `${courseSubject}-${courseNumber}`
      );

      if (!courseRole) {
        throw new Error(`Role not found: ${courseSubject}-${courseNumber}`);
      }

      if (subCommand === "add") {
        await student.roles.add(courseRole);
        await interaction.reply({
          content: `You are now notified for **${courseSubject.toUpperCase()}-${courseNumber}** updates.`,
          ephemeral: true,
        });
      } else if (subCommand === "remove") {
        await student.roles.remove(courseRole);
        await interaction.reply({
          content: `You are no longer notified for **${courseSubject.toUpperCase()}-${courseNumber}** updates.`,
          ephemeral: true,
        });
      }
    } catch (error: any) {
      logger.info(`Error handling course role: ${error.message}`);
      await interaction.reply({
        content: "An error occurred or the course code is invalid.",
        ephemeral: true,
      });
    }
  },
};

export { notifyModule as command };
