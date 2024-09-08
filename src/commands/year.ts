import {Config, logger} from "@/config";
import {handleEmbedResponse} from "@/helpers";
import {
  SlashCommandBuilder,
  SlashCommandStringOption,
  type CacheType,
  GuildMemberRoleManager,
  ChatInputCommandInteraction,
} from "discord.js";

const rolesMap = new Map<string, string>(Object.entries(Config.roles.years));
const choices: {name: string; value: string}[] = Array.from(rolesMap).map(
  ([key]) => ({
    name: key,
    value: key,
  })
);

const yearModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("year")
    .setDescription("Assign yourself a year role")
    .addStringOption((option: SlashCommandStringOption) =>
      option
        .setName("year")
        .setDescription("Your year")
        .setRequired(true)
        .addChoices(...choices)
    ),
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
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
            return await handleEmbedResponse(interaction, false, {
              message: `Removed the \`\`${selectedRole.name}\`\` role.`,
              ephemeral: false,
            });
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
            return await handleEmbedResponse(interaction, false, {
              message: `Added the \`\`${selectedRole.name}\`\` role.`,
              ephemeral: false,
            });
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
