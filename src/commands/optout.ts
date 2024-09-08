import {
  SlashCommandBuilder,
  GuildMember,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  type CacheType,
} from "discord.js";
import {Config} from "@/config";

// The roles that are eligible for opt-out
const availableRoles = [{name: "Event Ping", value: "event_ping"}];

const optOutModule: CommandType = {
  data: new SlashCommandBuilder()
    .setName("optout")
    .setDescription("Opt out from a role")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Select the role you want to opt out from")
        .setAutocomplete(true)
        .setRequired(true)
    ),
  autoComplete: async (interaction: AutocompleteInteraction) => {
    const focusedOption = interaction.options.getFocused();
    const member = interaction.member as GuildMember;

    // Filter roles based on what the user has
    const memberRoles = member.roles.cache.map((role) => role.id);
    const filteredRoles = availableRoles.filter((role) => {
      const roleId = (Config.roles.other as any)[role.value];
      return roleId && memberRoles.includes(roleId);
    });

    const filtered = filteredRoles.filter((role) =>
      role.name.toLowerCase().includes(focusedOption.toLowerCase())
    );

    await interaction.respond(
      filtered.map((role) => ({name: role.name, value: role.value}))
    );
  },
  execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const member = interaction.member as GuildMember;
    const selectedRole = interaction.options.getString("role")!;

    let roleId: string | undefined;

    if (selectedRole === "welcome_week") {
      roleId = Config.roles.other.event_ping;
    }

    if (!roleId) {
      await interaction.reply({
        content: "The selected role is not available for opt-out.",
        ephemeral: true,
      });
      return;
    }

    try {
      await member.roles.remove(roleId);
      await interaction.reply({
        content: `You have successfully opted out of the ${selectedRole.replace("_", " ")} role.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(`Error removing role from ${member.user.tag}:`, error);
      await interaction.reply({
        content: "An error occurred while trying to opt you out from the role.",
        ephemeral: true,
      });
    }
  },
};

export {optOutModule as command};
