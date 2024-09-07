import {
    SlashCommandBuilder,
    GuildMember,
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    CacheType,
  } from "discord.js";
import { Config } from "@/config";
import { CommandType } from "@/types";
  
// The roles that are eligible for opt-in
const availableRoles = [
{ name: "Welcome Week", value: "welcome_week" }
];

const optInModule: CommandType = {
data: new SlashCommandBuilder()
    .setName("optin")
    .setDescription("Opt in to a role")
    .addStringOption((option) =>
    option
        .setName("role")
        .setDescription("Select the role you want to opt in to")
        .setAutocomplete(true)
        .setRequired(true)
    ),
autoComplete: async (interaction: AutocompleteInteraction) => {
    const focusedOption = interaction.options.getFocused();
    const member = interaction.member as GuildMember;

    // Filter roles based on what the user does not have
    const memberRoles = member.roles.cache.map(role => role.id);
    const filteredRoles = availableRoles.filter(role => {
    const roleId = Config?.other_roles?.[role.value];
    return roleId && !memberRoles.includes(roleId);
    });

    const filtered = filteredRoles.filter(role =>
    role.name.toLowerCase().includes(focusedOption.toLowerCase())
    );

    await interaction.respond(
    filtered.map(role => ({ name: role.name, value: role.value }))
    );
},
execute: async (interaction: ChatInputCommandInteraction<CacheType>) => {
    const member = interaction.member as GuildMember;
    const selectedRole = interaction.options.getString("role")!;

    let roleId: string | undefined;

    if (selectedRole === "welcome_week") {
    roleId = Config?.other_roles?.welcome_week;
    }

    if (!roleId) {
    await interaction.reply({
        content: "The selected role is not available for opt-in.",
        ephemeral: true,
    });
    return;
    }

    try {
    await member.roles.add(roleId);
    await interaction.reply({
        content: `You have successfully opted in to the ${selectedRole.replace('_', ' ')} role.`,
        ephemeral: true,
    });
    } catch (error) {
    console.error(`Error adding role to ${member.user.tag}:`, error);
    await interaction.reply({
        content: "An error occurred while trying to opt you in to the role.",
        ephemeral: true,
    });
    }
},
};

export { optInModule as command };
  