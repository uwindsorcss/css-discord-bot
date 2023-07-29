import {CommandType} from "../types";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "@discordjs/builders";
import {
  CommandInteraction,
  CacheType,
  GuildMemberRoleManager,
  MessageEmbed,
} from "discord.js";
import {logger} from "../logger";
import {Config} from "../config";

const rolesMap = new Map(Object.entries(Config!.year_roles));

const yearModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("year")
    .setDescription("Assign yourself a year role")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("year")
        .setDescription("Your year")
        .setRequired(true)
        .addChoices(Array.from(rolesMap).map(([key]) => [key, key]))
    ),
  execute: async (interaction: CommandInteraction<CacheType>) => {
    try {
      const year = interaction.options.getString("year");
      const member = interaction.member;
      const memberRoles = member?.roles as GuildMemberRoleManager;
      const guild = interaction.guild;
      const guildRoles = guild?.roles.cache;

      const assignRole = async (roleID: string) => {
        const selectedRole = guildRoles?.get(roleID);
        if (selectedRole) {
          const hasRole = memberRoles?.cache.some((role) => role.id === roleID);
          if (hasRole) {
            // If the user already has the role, remove it.
            await memberRoles?.remove(roleID);
            const feedbackEmbed = new MessageEmbed()
              .setTitle("Successful :white_check_mark:")
              .setDescription(`Removed the \`\`${selectedRole.name}\`\` role.`);
            await interaction.reply({embeds: [feedbackEmbed]});
          } else {
            // Check if the user has any roles in the rolesMap, if so remove it them first.
            const rolesMapValues = Array.from(rolesMap.values());
            const hasAnyRole = memberRoles?.cache.some((role) => {
              return rolesMapValues.includes(role.id);
            });
            if (hasAnyRole) {
              await memberRoles?.remove(rolesMapValues);
            }
            await memberRoles?.add(roleID);
            const feedbackEmbed = new MessageEmbed()
              .setTitle("Successful :white_check_mark:")
              .setDescription(`Added the \`\`${selectedRole.name}\`\` role.`);
            await interaction.reply({embeds: [feedbackEmbed]});
          }
        }
      };

      const selectedRoleID = rolesMap.get(year || "");
      if (selectedRoleID) {
        return assignRole(selectedRoleID);
      }
    } catch (err) {
      logger.error({err});
    }
  },
};

export {yearModule as command};
